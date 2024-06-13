import * as React from 'react';
import { observer } from 'mobx-react';
import { I, Storage } from 'Lib';
import { Button } from 'Component';

const Index = observer(class Index extends React.Component<I.PageComponent> {

	render () {
		return (
			<div className="page pageIndex">
				<Button text="test" />
				<Button text="test" color="blank" />
				<Button text="test" color="red" />
			</div>
		);
	};

});

export default Index;