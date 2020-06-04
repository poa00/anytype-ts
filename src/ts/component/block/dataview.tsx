import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { I, C, StructDecode, DataUtil } from 'ts/lib';
import { observer } from 'mobx-react';

import Controls from './dataview/controls';

import ViewGrid from './dataview/view/grid';
import ViewBoard from './dataview/view/board';
import ViewGallery from './dataview/view/gallery';
import ViewList from './dataview/view/list';

interface Props extends RouteComponentProps<any> {
	rootId: string;
	block: I.Block;
};

interface State {
	view: string;
	data: any[];
};

const Constant = require('json/constant.json');
const Schema = {
	page: require('json/schema/page.json'),
	relation: require('json/schema/relation.json'),
};

@observer
class BlockDataview extends React.Component<Props, State> {

	state = {
		view: '',
		data: [],
	};
	
	constructor (props: any) {
		super(props);
		
		this.onOpen = this.onOpen.bind(this);
		this.onView = this.onView.bind(this);
		this.getContent = this.getContent.bind(this);
	};

	render () {
		const content = this.getContent();
		const { view } = content;

		if (!view) {
			return null;
		};

		let ViewComponent: React.ReactType<I.ViewComponent>;
		switch (view.type) {
			default:
			case I.ViewType.Grid:
				ViewComponent = ViewGrid;
				break;
				
			case I.ViewType.Board:
				ViewComponent = ViewBoard;
				break;
				
			case I.ViewType.Gallery:
				ViewComponent = ViewGallery;
				break;
			
			case I.ViewType.List:
				ViewComponent = ViewList;
				break;
		};
		
		return (
			<React.Fragment>
				<Controls {...this.props} content={content} onView={this.onView} />
				<div className="content">
					<ViewComponent {...this.props} onOpen={this.onOpen} content={content} />
				</div>
			</React.Fragment>
		);
	};

	componentDidMount () {
		this.getData();
	};
	
	onView (e: any, id: string) {
		this.setState({ view: id });
	};

	getContent () {
		const { data } = this.state;
		const { block } = this.props;
		const { content } = block;

		let schemaId = 'https://anytype.io/schemas/page';
		let schema = Schema[DataUtil.schemaField(schemaId)];
		let ret: any = {
			views: [],
			relations: [],
			data: data,
		};

		if (!schema) {
			return ret;
		};

		for (let field of schema.default) {
			ret.relations.push({
				id: field.id,
				name: field.name,
				type: DataUtil.schemaField(field.type),
			});
		};

		ret.views = content.views;
		ret.views = ret.views.map((view: I.View) => {
			
			// TMP
			if (!view.relations.find((it: I.ViewRelation) => { return it.id == 'id'; })) {
				view.relations.push({ id: 'id', visible: true });
			};
			if (!view.relations.find((it: I.ViewRelation) => { return it.id == 'description'; })) {
				view.relations.push({ id: 'description', visible: true });
			};

			view.relations = view.relations.map((relation: I.ViewRelation) => {
				const rel = ret.relations.find((it: I.Relation) => { return it.id == relation.id; });
				return Object.assign(rel, relation);
			});
			return view;
		});
		
		if (ret.views.length) {
			const view = this.state.view || ret.views[0].id;
			ret.view = ret.views.find((item: any) => { return item.id == view; });
		};

		return ret;
	};

	getData () {
		C.NavigationListPages((message: any) => {
			let pages = message.pages.map((it: any) => { return this.getPage(it); });
			this.setState({ data: pages.slice(0, 10) });
		});
	};

	getPage (page: any): I.PageInfo {
		let details = StructDecode.decodeStruct(page.details || {});
		details.name = String(details.name || Constant.default.name || '');

		return {
			id: page.id,
			description: page.snippet,
			...details,
		};
	};

	onOpen (e: any, data: any) {
		DataUtil.pageOpen(e, data.id);
	};
	
};

export default BlockDataview;