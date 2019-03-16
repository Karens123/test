// Author: linjh
// Date: 2017-09-26
// Usage: Jenkins的自动Pipeline构建脚本

//定义常量和变量
def projectName = "wenwen-app-admin"
def sourceDir = "."
def swarmServiceName = "wenwen-app-admin"
def swarmStackName = "web-app-admin"
def gitRepo = "git@wenwenkj.com:wenwen-html/${projectName}.git";
def httpRepo = "git@wenwenkj.com:wenwen-html/${projectName}.git";
def credentials = "8ae91289-3ed0-4ee5-865c-a9d5faa975fc";
def registryUrl = "wenwenkj.com:5000";
def imageName = "wenwenkj.com:5000/wenwen-html/${projectName}";
def registryUsername = "deploy";
def registryPassword = "deploy123";
def recvEmail = "jiangxj@wenwen-tech.com,linjh@wenwen-tech.com"

stage("Common") {
    node("build") {
        echo "Environment: ${ENV}, Branch: ${BRANCH}, Version: ${VERSION}, ClusterMode: ${CLUSTER_MODE}"

        //前置检查
        //1. develop分支不需带上版本号, master分支需要带上版本号
        if (params.BRANCH != "origin/master") {
            if (params.VERSION != "") {
                error("Only [master] branch can have version. Please check your input!")
            }
        } else {
            if (params.VERSION == "") {
                error("[master] branch should have version. Please check your input!")
            }
        }

        //2. 环境检查
        if (params.ENV != "all" && params.ENV != "dev"
                && params.ENV != "test" && params.ENV != "staging"
                && params.ENV != "prod") {
            error("[Environment] should be all, dev, test, staging, prod")
        }

        //3. 发布master到生产之前进行二次确认
        if (params.ENV == "prod") {
            if (params.BRANCH == "origin/master") {
                try {
                    timeout(time: 15, unit: 'SECONDS') {
                        input message: '将会直接发布到生产环境, 确定要发布吗',
                                parameters: [[$class      : 'BooleanParameterDefinition',
                                              defaultValue: false,
                                              description : '点击将会发布生产环境',
                                              name        : '发布生产环境']]
                    }
                } catch (err) {
                    def user = err.getCauses()[0].getUser()
                    error "Aborted by:\n ${user}"
                }
            } else {
                error "发布到生产环境需要为[master]分支"
            }
        }
    }
}

//1. 使用构建Node进行构建
stage("Build") {
    if (params.ENV != "prod") {
        if (params.BUILD_MODE != "nobuild") {
            node("build") {
                // 1. 从Git中clone代码
                git branch: "develop", credentialsId: "${credentials}", url: "${httpRepo}"

                //sh "npm install"

                // 2. 构建Image, 并push到Registry中
                sh "docker build -t ${imageName} ${sourceDir}"
                sh "docker login -u ${registryUsername} -p ${registryPassword} ${registryUrl}"
                sh "docker push ${imageName}"
            }
        }
    }
}

//2. 发布到开发(dev)环境: develop分支
stage("Develop") {
    if (params.ENV == "all" || params.ENV == "dev") {
        node("dev") {
            git branch: "develop", credentialsId: "${credentials}", url: "${httpRepo}"

            sh "docker login -u ${registryUsername} -p ${registryPassword} ${registryUrl}"

            sh "docker-compose -f ${sourceDir}/docker-compose.dev.yml pull"

            if (params.CLUSTER_MODE == "init") {
                sh "docker stack deploy -c ${sourceDir}/docker-compose.dev.yml --with-registry-auth ${swarmStackName}"
            } else if (params.CLUSTER_MODE == "default") {
                sh "docker service update ${swarmStackName}_${swarmServiceName} --force --image ${imageName}"
            }
        }
    }
}

//3. 发布到测试(test)环境: Swarm集群
stage("Test") {
    if (params.ENV == "all" || params.ENV == "test") {
        node("test") {
            git branch: "develop", credentialsId: "${credentials}", url: "${httpRepo}"

            sh "docker login -u ${registryUsername} -p ${registryPassword} ${registryUrl}"

            sh "docker-compose -f ${sourceDir}/docker-compose.test.yml pull"

            if (params.CLUSTER_MODE == "init") {
                sh "docker stack deploy -c ${sourceDir}/docker-compose.test.yml --with-registry-auth ${swarmStackName}"
            } else if (params.CLUSTER_MODE == "default") {
                sh "docker service update ${swarmStackName}_${swarmServiceName} --force --image ${imageName}"
            }

            mail(to: "${recvEmail}",
                    subject: "Project '${env.JOB_NAME}' (${env.BUILD_NUMBER}) Deploy to Test",
                    body: "Please go to ${env.BUILD_URL}.",
            )
        }
    }
}

//4. 发布到准发布(staging)环境
stage("Staging") {
    if (params.ENV == "all" || params.ENV == "staging") {
        node("staging") {
            git branch: "develop", credentialsId: "${credentials}", url: "${httpRepo}"

            sh "docker login -u ${registryUsername} -p ${registryPassword} ${registryUrl}"

            sh "docker-compose -f ${sourceDir}/docker-compose.staging.yml pull"

            if (params.CLUSTER_MODE == "init") {
                sh "docker stack deploy -c ${sourceDir}/docker-compose.staging.yml --with-registry-auth ${swarmStackName}"
            } else if (params.CLUSTER_MODE == "default") {
                sh "docker service update ${swarmStackName}_${swarmServiceName} --force --image ${imageName}"
            }
        }
    }
}

/** 替换版本号*/
def replaceVersion() {
    sh "echo Replace latest to ${VERSION} in ./docker-compose.prod.yml"
    sh "sed -i 's|:latest|:${VERSION}|g\' ./docker-compose.prod.yml"
}

//5. 发布到生产(prod)环境: 只有打包master分支, 才进行prod环境部署
stage("Production") {
    def tagVersion = "${projectName}-V${VERSION}";

    if (params.ENV == "prod" && params.BRANCH == "origin/master") {
        node("build") {
            if (params.BUILD_MODE != "nobuild") {
                sh "echo Deploying to Production for ${BRANCH}, version is ${VERSION}"

                //1. 从develop分支中获取代码
                git branch: "master", credentialsId: "${credentials}", url: "${gitRepo}"
                sh "git pull origin develop"

                //sh "npm install"

                //2. 替换版本号
                replaceVersion();

                //3. 构建Image, 并push到Registry中
                sh "docker build -t ${imageName}:${VERSION} ${sourceDir}"
                sh "docker login -u ${registryUsername} -p ${registryPassword} ${registryUrl}"
                sh "docker push ${imageName}:${VERSION}"

                //4. 打tag
                sh "git tag ${tagVersion} -m 'Release ${tagVersion}'"
                sh "git push origin master"
                sh "git push origin ${tagVersion}"

                //5. 恢复重置
                sh "echo 'Reset the version to master-SNAPSHOT'"
                sh "git reset --hard"
            }
        }

// 暂不对外开放，只支持内网生产
//        node("prod") {
//            git branch: "master", credentialsId: "${credentials}", url: "${httpRepo}"
//
//            replaceVersion();
//
//            sh "docker login -u ${registryUsername} -p ${registryPassword} ${registryUrl}"
//
//            //由于外网pull image速度比较慢, 先提前在所有运行节点pull image, 避免停机维护时间
//            sh "docker-compose -f ${sourceDir}/docker-compose.prod.yml pull"
//
//            sh "docker save ${imageName}:${VERSION} -o ${projectName}-${VERSION}.tar"
//
//            sh "scp -P 20502 ${projectName}-${VERSION}.tar apps@wenwen-01:/app/apps"
//            sh "ssh -p 20502 apps@wenwen-01 docker load -i ${projectName}-${VERSION}.tar"
//            sh "ssh -p 20502 apps@wenwen-01 rm ${projectName}-${VERSION}.tar"
//
//            sh "scp -P 20502 ${projectName}-${VERSION}.tar apps@wenwen-02:/app/apps"
//            sh "ssh -p 20502 apps@wenwen-02 docker load -i ${projectName}-${VERSION}.tar"
//            sh "ssh -p 20502 apps@wenwen-02 rm ${projectName}-${VERSION}.tar"
//
//            sh "scp -P 20502 ${projectName}-${VERSION}.tar apps@wenwen-03:/app/apps"
//            sh "ssh -p 20502 apps@wenwen-03 docker load -i ${projectName}-${VERSION}.tar"
//            sh "ssh -p 20502 apps@wenwen-03 rm ${projectName}-${VERSION}.tar"
//
//            sh "scp -P 20502 ${projectName}-${VERSION}.tar apps@wenwen-04:/app/apps"
//            sh "ssh -p 20502 apps@wenwen-04 docker load -i ${projectName}-${VERSION}.tar"
//            sh "ssh -p 20502 apps@wenwen-04 rm ${projectName}-${VERSION}.tar"
//
//            sh "scp -P 20502 ${projectName}-${VERSION}.tar apps@wenwen-05:/app/apps"
//            sh "ssh -p 20502 apps@wenwen-05 docker load -i ${projectName}-${VERSION}.tar"
//            sh "ssh -p 20502 apps@wenwen-05 rm ${projectName}-${VERSION}.tar"
//
//            sh "rm ${projectName}-${VERSION}.tar"
//
//            if (params.CLUSTER_MODE == "init") {
//                sh "docker stack deploy -c ${sourceDir}/docker-compose.prod.yml --with-registry-auth ${swarmStackName}"
//
//                mail(to: "${recvEmail}",
//                        subject: "Project '${env.JOB_NAME}' (${env.BUILD_NUMBER}) Deploy to Production",
//                        body: "Please go to ${env.BUILD_URL}.",
//                )
//            } else if (params.CLUSTER_MODE == "default") {
//                sh "docker service update ${swarmStackName}_${swarmServiceName} --force --image ${imageName}:${VERSION}"
//
//                mail(to: "${recvEmail}",
//                        subject: "Project '${env.JOB_NAME}' (${env.BUILD_NUMBER}) Deploy to Production",
//                        body: "Please go to ${env.BUILD_URL}.",
//                )
//            }
//        }

        // 内网生产
        node("inner_prod") {
            git branch: "master", credentialsId: "${credentials}", url: "${httpRepo}"

            replaceVersion();

            sh "docker login -u ${registryUsername} -p ${registryPassword} ${registryUrl}"

            sh "docker-compose -f ${sourceDir}/docker-compose.prod.yml pull"

            if (params.CLUSTER_MODE == "init") {
                sh "docker stack deploy -c ${sourceDir}/docker-compose.prod.yml --with-registry-auth ${swarmStackName}"
            } else if (params.CLUSTER_MODE == "default") {
                sh "docker service update ${swarmStackName}_${swarmServiceName} --force --image ${imageName}:${VERSION}"
            }

            mail(to: "${recvEmail}",
                    subject: "Project '${env.JOB_NAME}' (${env.BUILD_NUMBER}) Deploy to Production",
                    body: "Please go to ${env.BUILD_URL}.",
            )
        }
    }
}