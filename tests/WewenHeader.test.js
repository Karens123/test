import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import WenwenHeader from 'framework/components/WenwenHeader';

import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;

const mockCurrentUser = {
	username: 'testUser',
};

describe('WenwenHeader', function () {
	let header = shallow(
		<WenwenHeader currentUser={mockCurrentUser} />);

	it('validate WenwenHeader currentUser', () => {
		expect(shallow(header.find(SubMenu).prop('title')).contains(mockCurrentUser.username)).to.equal(true);
	});
	describe('validate WenwenHeader Menu', () => {
		const menu = header.find(Menu);
		it('Menu exists', ()=> {
			expect(menu).to.have.length(1);
		});
		const menuItems = menu.find(Menu.Item);
		it('Menu item size is 5', () => {
			expect(menuItems).to.have.length(5);
		});

	});

});
