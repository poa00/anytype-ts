import { I, M, UtilCommon, Encode, Decode } from 'Lib';
import { Commands, Model, Events } from './pb';

const { Rpc } = Commands;

export const Mapper = {

	BlockType: (v: number): I.BlockType => {
		const V = Model.Block.ContentCase;

		let t = I.BlockType.Empty;
		if (v == V.SMARTBLOCK)			 t = I.BlockType.Page;
		if (v == V.TEXT)				 t = I.BlockType.Text;
		if (v == V.FILE)				 t = I.BlockType.File;
		if (v == V.LAYOUT)				 t = I.BlockType.Layout;
		if (v == V.DIV)					 t = I.BlockType.Div;
		if (v == V.BOOKMARK)			 t = I.BlockType.Bookmark;
		if (v == V.LINK)				 t = I.BlockType.Link;
		if (v == V.DATAVIEW)			 t = I.BlockType.Dataview;
		if (v == V.RELATION)			 t = I.BlockType.Relation;
		if (v == V.FEATUREDRELATIONS)	 t = I.BlockType.Featured;
		if (v == V.LATEX)				 t = I.BlockType.Embed;
		if (v == V.TABLE)				 t = I.BlockType.Table;
		if (v == V.TABLECOLUMN)			 t = I.BlockType.TableColumn;
		if (v == V.TABLEROW)			 t = I.BlockType.TableRow;
		if (v == V.TABLEOFCONTENTS)		 t = I.BlockType.TableOfContents;
		if (v == V.WIDGET)		 		 t = I.BlockType.Widget;
		return t;
	},

	BoardGroupType (v: number) {
		const V = Model.Block.Content.Dataview.Group.ValueCase;

		let t = '';
		if (v == V.STATUS)	 t = 'status';
		if (v == V.TAG)		 t = 'tag';
		if (v == V.CHECKBOX) t = 'checkbox';
		if (v == V.DATE)	 t = 'date';
		return t;
	},

	NotificationPayload (v: number) {
		const V = Model.Notification.PayloadCase;

		let t = '';
		if (v == V.IMPORT)			 t = 'import';
		if (v == V.EXPORT)			 t = 'export';
		if (v == V.GALLERYIMPORT)	 t = 'galleryImport';
		if (v == V.REQUESTTOJOIN)	 t = 'requestToJoin';
		if (v == V.REQUESTTOLEAVE)	 t = 'requestToLeave';
		if (v == V.PARTICIPANTREQUESTAPPROVED)	 t = 'participantRequestApproved';
		if (v == V.PARTICIPANTREMOVE) t = 'participantRemove';
		if (v == V.PARTICIPANTREQUESTDECLINE) t = 'participantRequestDecline';
		if (v == V.PARTICIPANTPERMISSIONSCHANGE) t = 'participantPermissionsChange';

		return t;
	},

	From: {

		Account: (obj: any): I.Account => {
			return {
				id: obj.getId(),
				info: obj.hasInfo() ? Mapper.From.AccountInfo(obj.getInfo()) : null,
				config: obj.hasConfig() ? Mapper.From.AccountConfig(obj.getConfig()) : null,
				status: obj.hasStatus() ? Mapper.From.AccountStatus(obj.getStatus()) : null,
			};
		},

		AccountInfo: (obj: any): I.AccountInfo => {
			return {
				homeObjectId: obj.getHomeobjectid(),
				profileObjectId: obj.getProfileobjectid(),
				gatewayUrl: obj.getGatewayurl(),
				deviceId: obj.getDeviceid(),
				localStoragePath: obj.getLocalstoragepath(),
				accountSpaceId: obj.getAccountspaceid(),
				spaceViewId: obj.getSpaceviewid(),
				widgetsId: obj.getWidgetsid(),
				analyticsId: obj.getAnalyticsid(),
				networkId: obj.getNetworkid(),
			};
		},

		AccountConfig: (obj: any): I.AccountConfig => {
			return {};
		},

		AccountStatus: (obj: any): I.AccountStatus => {
			return {
				type: obj.getStatustype() as number,
				date: obj.getDeletiondate(),
			};
		},
		
		ObjectInfo: (obj: any): I.PageInfo => {
			return {
				id: obj.getId(),
				details: Decode.struct(obj.getDetails()),
				snippet: obj.getSnippet(),
				hasInboundLinks: obj.getHasinboundlinks(),
			};
		},

		Record: (obj: any): any => {
			return Decode.struct(obj);
		},

		Range: (obj: any): I.TextRange => {
			return {
				from: obj.getFrom(),
				to: obj.getTo(),
			};
		},

		Mark: (obj: any): I.Mark => {
			return {
				type: obj.getType() as number,
				param: obj.getParam(),
				range: Mapper.From.Range(obj.getRange()),
			};
		},

		PreviewLink: (obj: any) => {
            return {
                type: obj.getType(),
                title: obj.getTitle(),
                description: obj.getDescription(),
                faviconUrl: obj.getFaviconurl(),
                imageUrl: obj.getImageurl(),
                url: obj.getUrl(),
            };
        },

		Details: (obj: any): any => {
			return {
				id: obj.getId(),
				details: Decode.struct(obj.getDetails()),
			};
		},

		BlockPage: () => {
			return {};
		},

		BlockFeatured: () => {
			return {};
		},

		BlockLayout: (obj: any) => {
			return {
				style: obj.getStyle(),
			};
		},

		BlockDiv: (obj: any) => {
			return {
				style: obj.getStyle(),
			};
		},

		BlockLink: (obj: any) => {
			return {
				targetBlockId: obj.getTargetblockid(),
				iconSize: obj.getIconsize(),
				cardStyle: obj.getCardstyle(),
				description: obj.getDescription(),
				relations: obj.getRelationsList() || [],
			};
		},

		BlockBookmark: (obj: any) => {
			return {
				targetObjectId: obj.getTargetobjectid(),
				state: obj.getState(),
				url: obj.getUrl(),
			};
		},

		BlockText: (obj: any) => {
			let marks = [];
			if (obj.hasMarks()) {
				marks = (obj.getMarks().getMarksList() || []).map(Mapper.From.Mark);
			};

			return {
				text: obj.getText(),
				style: obj.getStyle(),
				checked: obj.getChecked(),
				color: obj.getColor(),
				marks,
				iconEmoji: obj.getIconemoji(),
				iconImage: obj.getIconimage(),
			};
		},

		BlockFile: (obj: any) => {
			return {
				targetObjectId: obj.getTargetobjectid(),
				type: obj.getType(),
				style: obj.getStyle(),
				addedAt: obj.getAddedat(),
				state: obj.getState(),
			};
		},

		BlockDataview: (obj: any) => {
			return {
				sources: obj.getSourceList(),
				viewId: obj.getActiveview(),
				views: (obj.getViewsList() || []).map(Mapper.From.View),
				relationLinks: (obj.getRelationlinksList() || []).map(Mapper.From.RelationLink),
				groupOrder: (obj.getGroupordersList() || []).map(Mapper.From.GroupOrder),
				objectOrder: (obj.getObjectordersList() || []).map(Mapper.From.ObjectOrder),
				targetObjectId: obj.getTargetobjectid(),
				isCollection: obj.getIscollection(),
			};
		},

		BlockRelation: (obj: any) => {
			return {
				key: obj.getKey(),
			};
		},

		BlockLatex: (obj: any) => {
			return {
				text: obj.getText(),
				processor: obj.getProcessor(),
			};
		},

		BlockTableOfContents: () => {
			return {};
		},

		BlockTable: () => {
			return {};
		},
	
		BlockTableColumn: () => {
			return {};
		},

		BlockTableRow: (obj: any) => {
			return {
				isHeader: obj.getIsheader(),
			};
		},

		BlockWidget: (obj: any) => {
			return {
				layout: obj.getLayout(),
				limit: obj.getLimit(),
				viewId: obj.getViewid(),
			};
		},

		Block: (obj: any): I.Block => {
			const cc = obj.getContentCase();
			const type = Mapper.BlockType(obj.getContentCase());
			const fn = `get${UtilCommon.ucFirst(type)}`;
			const fm = UtilCommon.toUpperCamelCase(`block-${type}`);
			const content = obj[fn] ? obj[fn]() : {};
			const item: I.Block = {
				id: obj.getId(),
				type: type,
				childrenIds: obj.getChildrenidsList() || [],
				fields: Decode.struct(obj.getFields()) || {},
				hAlign: obj.getAlign() as number,
				vAlign: obj.getVerticalalign() as number,
				bgColor: obj.getBackgroundcolor(),
				content: {} as any,
			};

			if (Mapper.From[fm]) {
				item.content = Mapper.From[fm](content);
			} else {
				console.log('[Mapper] From does not exist: ', fm, cc);
			};
			return item;
		},

		Restrictions: (obj: any): any => {
			return {
				object: obj ? obj.getObjectList() || [] : [],
				dataview: obj ? (obj.getDataviewList() || []).map(Mapper.From.RestrictionsDataview) : [],
			};
		},

		RestrictionsDataview: (obj: any): any => {
			return {
				blockId: obj.getBlockid(),
				restrictions: obj.getRestrictionsList() || [],
			};
		},

		RelationLink: (obj: any): any => {
			return {
				relationKey: obj.getKey(),
				format: obj.getFormat(),
			};
		},

		View: (obj: any): I.View => {
			return Object.assign({
				id: obj.getId(),
				sorts: obj.getSortsList().map(Mapper.From.Sort),
				filters: obj.getFiltersList().map(Mapper.From.Filter),
				relations: obj.getRelationsList().map(Mapper.From.ViewRelation),
			}, Mapper.From.ViewFields(obj));
		},

		ViewFields: (obj: any): any => {
			return {
				type: obj.getType(),
				name: obj.getName(),
				coverRelationKey: obj.getCoverrelationkey(),
				coverFit: obj.getCoverfit(),
				cardSize: obj.getCardsize(),
				hideIcon: obj.getHideicon(),
				groupRelationKey: obj.getGrouprelationkey(),
				groupBackgroundColors: obj.getGroupbackgroundcolors(),
				pageLimit: obj.getPagelimit(),
				defaultTemplateId: obj.getDefaulttemplateid(),
				defaultTypeId: obj.getDefaultobjecttypeid(),
			};
		},

		ViewRelation: (obj: any) => {
            return {
                relationKey: obj.getKey(),
                isVisible: obj.getIsvisible(),
                width: obj.getWidth(),
				includeTime: obj.getDateincludetime(),
                timeFormat: obj.getTimeformat(),
				dateFormat: obj.getDateformat(),
            };
        },

		Filter: (obj: any): I.Filter => {
			return {
				id: obj.getId(),
				relationKey: obj.getRelationkey(),
				operator: obj.getOperator() as number,
				condition: obj.getCondition() as number,
				quickOption: obj.getQuickoption() as number,
				value: obj.hasValue() ? Decode.value(obj.getValue()) : null,
			};
		},

		Sort: (obj: any): I.Sort => {
			return {
				id: obj.getId(),
				relationKey: obj.getRelationkey(),
				type: obj.getType() as number,
				customOrder: (obj.getCustomorderList() || []).map(Decode.value),
				empty: obj.getEmptyplacement() as number,
			};
		},

		HistoryVersion: (obj: any): I.HistoryVersion => {
			return {
				id: obj.getId(),
				previousIds: obj.getPreviousidsList() || [],
				authorId: obj.getAuthorid(),
				groupId: obj.getGroupid(),
				time: obj.getTime(),
			};
		},

		ThreadSummary: (obj: any) => {
            return {
                status: Number(obj.getStatus() || I.ThreadStatus.Unknown),
            };
        },

		ThreadCafe: (obj: any) => {
            return {
                status: Number(obj.getStatus() || I.ThreadStatus.Unknown),
                lastPulled: obj.getLastpulled(),
                lastPushSucceed: obj.getLastpushsucceed(),
				files: Mapper.From.ThreadFiles(obj.getFiles()),
            };
        },

		ThreadFiles: (obj: any) => {
            return {
				pinning: obj.getPinning(),
				pinned: obj.getPinned(),
				failed: obj.getFailed(),
				updated: obj.getUpdated(),
            };
        },

		ThreadDevice: (obj: any) => {
            return {
                name: obj.getName(),
				online: obj.getOnline(),
                lastPulled: obj.getLastpulled(),
                lastEdited: obj.getLastedited(),
            };
        },

		ThreadAccount: (obj: any) => {
            return {
				id: obj.getId(),
				name: obj.getName(),
				imageHash: obj.getImagehash(),
				online: obj.getOnline(),
                lastPulled: obj.getLastpulled(),
                lastEdited: obj.getLastedited(),
				devices: (obj.getDevicesList() || []).map(Mapper.From.ThreadDevice),
            };
        },

		GraphEdge: (obj: any) => {
            return {
				type: obj.getType(),
				source: obj.getSource(),
				target: obj.getTarget(),
				name: obj.getName(),
				description: obj.getDescription(),
				iconImage: obj.getIconimage(),
				iconEmoji: obj.getIconemoji(),
				isHidden: obj.getHidden(),
            };
        },

		UnsplashPicture: (obj: any) => {
			return {
                id: obj.getId(),
				url: obj.getUrl(),
				artist: obj.getArtist(),
				artistUrl: obj.getArtisturl(),
            };
		},

		ObjectView: (obj: any) => {
			return {
				rootId: obj.getRootid(),
				blocks: (obj.getBlocksList() || []).map(Mapper.From.Block),
				details: (obj.getDetailsList() || []).map(Mapper.From.Details),
				relationLinks: (obj.getRelationlinksList() || []).map(Mapper.From.RelationLink),
				restrictions: Mapper.From.Restrictions(obj.getRestrictions()),
				participants: (obj.getBlockparticipantsList() || []).map(it => ({
					blockId: it.getBlockid(),
					participantId: it.getParticipantid(),
				})),
			};
		},

		BoardGroup: (obj: any): I.BoardGroup => {
			const type = Mapper.BoardGroupType(obj.getValueCase());
			const fn = `get${UtilCommon.ucFirst(type)}`;
			const field = obj[fn] ? obj[fn]() : null;

			let value: any = null;

			if (field) {
				switch (type) {
					case 'status':	 value = field.getId(); break;
					case 'tag':		 value = field.getIdsList(); break;
					case 'checkbox': value = field.getChecked(); break;
				};
			};

			return { 
				id: obj.getId(),
				value,
			};
		},

		GroupOrder: (obj: any) => {
			return {
				viewId: obj.getViewid(),
				groups: (obj.getViewgroupsList() || []).map((it: any) => {
					return {
						groupId: it.getGroupid(),
						index: it.getIndex(),
						isHidden: it.getHidden(),
						bgColor: it.getBackgroundcolor(),
					};
				}),
			};
		},

		ObjectOrder: (obj: any) => {
			return {
				viewId: obj.getViewid(),
				groupId: obj.getGroupid(),
				objectIds: obj.getObjectidsList() || [],
			};
		},

		ObjectSearchWithMeta: (obj: any) => {
			return {
				...Decode.struct(obj.getDetails()),
				metaList: (obj.getMetaList() || []).map(Mapper.From.MetaList),
			};
		},

		Notification: (obj: any): I.Notification => {
			const type = Mapper.NotificationPayload(obj.getPayloadCase());
			const fn = `get${UtilCommon.ucFirst(type)}`;
			const field = obj[fn] ? obj[fn]() : null;
			
			let payload: any = {};

			if (field) {
				switch (type) {

					case I.NotificationType.Import:
					case I.NotificationType.Gallery: {
						payload = Object.assign(payload, {
							processId: field.getProcessid(),
							errorCode: field.getErrorcode(),
							spaceId: field.getSpaceid(),
							name: field.getName(),
						});

						if (type == I.NotificationType.Import) {
							payload.importType = field.getImporttype();
						};

						if (type == I.NotificationType.Gallery) {
							payload.spaceName = field.getSpacename();
						};
						break;
					};

					case I.NotificationType.Export: {
						payload = Object.assign(payload, {
							errorCode: field.getErrorcode(),
							exportType: field.getExporttype(),
						});
						break;
					};

					case I.NotificationType.Join: 
					case I.NotificationType.Leave: 
					case I.NotificationType.Remove: {
						payload = Object.assign(payload, {
							spaceId: field.getSpaceid(),
							spaceName: field.getSpacename(),
							identity: field.getIdentity(),
							identityName: field.getIdentityname(),
							identityIcon: field.getIdentityicon(),
						});
						break;
					};

					case I.NotificationType.Permission:
					case I.NotificationType.Approve: {
						payload = Object.assign(payload, {
							spaceId: field.getSpaceid(),
							spaceName: field.getSpacename(),
        					permissions: field.getPermissions(),
						});
						break;
					};

					case I.NotificationType.Decline: {
						payload = Object.assign(payload, {
							spaceId: field.getSpaceid(),
							spaceName: field.getSpacename(),
						});
						break;
					};

				};
			};

			return {
				id: obj.getId(),
				createTime: obj.getCreatetime(),
				status: obj.getStatus() as number,
				isLocal: obj.getIslocal(),
				type: type as I.NotificationType,
				payload,
			};
		},

		Manifest: (obj: any) => {
			return {
				id: obj.getId(),
				schema: obj.getSchema(),
				name: obj.getName(),
				author: obj.getAuthor(),
				license: obj.getLicense(),
				title: obj.getTitle(),
				description: obj.getDescription(),
				downloadLink: obj.getDownloadlink(),
				size: obj.getFilesize(),
				screenshots: obj.getScreenshotsList() || [],
				categories: obj.getCategoriesList() || [],
			};
		},

		Membership: (obj: any): I.Membership => {
			return {
				tier: obj.getTier(),
				status: obj.getStatus() as number,
				dateStarted: obj.getDatestarted(),
				dateEnds: obj.getDateends(),
				isAutoRenew: obj.getIsautorenew(),
				paymentMethod: obj.getPaymentmethod() as number,
				name: obj.getNsname(),
				nameType: obj.getNsnametype() as number,
				userEmail: obj.getUseremail(),
				subscribeToNewsletter: obj.getSubscribetonewsletter(),	
			};
		},

		MembershipTierData: (obj: any): I.MembershipTier => {
			return {
				id: obj.getId(),
				name: obj.getName(),
				description: obj.getDescription(),
				nameMinLength: obj.getAnynameminlength(),
				isTest: obj.getIstest(),
				periodType: obj.getPeriodtype(),
				period: obj.getPeriodvalue(),
				priceCents: obj.getPricestripeusdcents(),
				colorStr: obj.getColorstr(),
				features: obj.getFeaturesList(),
				namesCount: obj.getAnynamescountincluded()
			};
		},

		Process: (obj: any) => {
			return {
				id: obj.getId(),
				state: obj.getState() as number,
				type: obj.getType() as number,
				progress: Mapper.From.Progress(obj.getProgress())
			};
		},

		Progress: (obj: any) => {
			return {
				done: obj.getDone(),
				total: obj.getTotal(),
				message: obj.getMessage(),
			};
		},

		MetaList: (obj: any): any => {
			return {
				highlight: obj.getHighlight(),
				blockId: obj.getBlockid(),
				relationKey: obj.getRelationkey(),
				relationDetails: Decode.struct(obj.getRelationdetails()),
				ranges: (obj.getHighlightrangesList() || []).map(Mapper.From.Range),
			};
		},

    },

	//------------------------------------------------------------

	To: {

		Range: (obj: any) => {
			const item = new Model.Range();

			item.setFrom(obj.from);
			item.setTo(obj.to);

			return item;
		},

		Mark: (obj: any) => {
			const item = new Model.Block.Content.Text.Mark();

			item.setType(obj.type);
			item.setParam(obj.param);
			item.setRange(Mapper.To.Range(obj.range));

			return item;
		},

		Details: (obj: any) => {
			const item = new Model.Detail();

			item.setKey(obj.key);
			item.setValue(Encode.value(obj.value));

			return item;
		},

		Fields: (obj: any) => {
			const item = new Rpc.Block.ListSetFields.Request.BlockField();

			item.setBlockid(obj.blockId);
			item.setFields(Encode.struct(obj.fields || {}));

			return item;
		},

		BlockFeatured: () => {
			return new Model.Block.Content.FeaturedRelations();
		},

		BlockLayout: (obj: any) => {
			const content = new Model.Block.Content.Layout();
			
			content.setStyle(obj.style);

			return content;
		},

		BlockText: (obj: any) => {
			const marks = (obj.marks || []).map(Mapper.To.Mark);
			const content = new Model.Block.Content.Text();

			content.setText(obj.text);
			content.setStyle(obj.style);
			content.setChecked(obj.checked);
			content.setColor(obj.color);
			content.setMarks(new Model.Block.Content.Text.Marks().setMarksList(marks));
			content.setIconemoji(obj.iconEmoji);
			content.setIconimage(obj.iconImage);

			return content;
		},

		BlockFile: (obj: any) => {
			const content = new Model.Block.Content.File();
	
			content.setTargetobjectid(obj.targetObjectId);
			content.setType(obj.type);
			content.setAddedat(obj.addedAt);
			content.setState(obj.state);
			content.setStyle(obj.style);
			content.setTargetobjectid(obj.targetObjectId);

			return content;
		},

		BlockBookmark: (obj: any) => {
			const content = new Model.Block.Content.Bookmark();
	
			content.setTargetobjectid(obj.targetObjectId);
			content.setState(obj.state);
			content.setUrl(obj.url);

			return content;
		},

		BlockLink: (obj: any) => {
			const content = new Model.Block.Content.Link();
	
			content.setTargetblockid(obj.targetBlockId);
			content.setIconsize(obj.iconSize);
			content.setCardstyle(obj.cardStyle);
			content.setDescription(obj.description);
			content.setRelationsList(obj.relations);

			return content;
		},

		BlockDiv: (obj: any) => {
			const content = new Model.Block.Content.Div();

			content.setStyle(obj.style);

			return content;
		},

		BlockRelation: (obj: any) => {
			const content = new Model.Block.Content.Relation();

			content.setKey(obj.key);

			return content;
		},

		BlockLatex: (obj: any) => {
			const content = new Model.Block.Content.Latex();
	
			content.setText(obj.text);
			content.setProcessor(obj.processor);

			return content;
		},

		BlockDataview: (obj: any) => {
			const content = new Model.Block.Content.Dataview();

			content.setTargetobjectid(obj.targetObjectId);
			content.setIscollection(obj.isCollection);
			content.setViewsList((obj.views || []).map(Mapper.To.View));
	
			return content;
		},

		BlockTable: () => {
			const content = new Model.Block.Content.Table();

			return content;
		},

		BlockTableRow: (obj: any) => {
			const content = new Model.Block.Content.TableRow();

			content.setIsheader(obj.isHeader);

			return content;
		},

		BlockTableColumn: () => {
			const content = new Model.Block.Content.TableColumn();

			return content;
		},

		BlockTableOfContents: () => {
			const content = new Model.Block.Content.TableOfContents();
	
			return content;
		},

		BlockWidget: (obj: any) => {
			const content = new Model.Block.Content.Widget();
			
			content.setLayout(obj.layout);
			content.setLimit(obj.limit);
			content.setViewid(obj.viewId);

			return content;
		},

		Block: (obj: any) => {
			obj = obj || {};
			obj.type = String(obj.type || I.BlockType.Empty);
			obj.content = UtilCommon.objectCopy(obj.content || {});
	
			const block = new Model.Block();
	
			block.setId(obj.id);
			block.setAlign(obj.hAlign);
			block.setVerticalalign(obj.vAlign);
			block.setBackgroundcolor(obj.bgColor);
	
			if (obj.childrenIds) {
				block.setChildrenidsList(obj.childrenIds);
			};
	
			if (obj.fields) {
				block.setFields(Encode.struct(obj.fields || {}));
			};

			const fb = UtilCommon.toCamelCase(`set-${obj.type.toLowerCase()}`);
			const fm = UtilCommon.toUpperCamelCase(`block-${obj.type}`);

			if (block[fb] && Mapper.To[fm]) {
				block[fb](Mapper.To[fm](obj.content));
			} else {
				console.log('[Mapper] Block method or To method do not exist: ', fb, fm);
			};

			return block;
		},

		ViewRelation: (obj: any) => {
			const item = new Model.Block.Content.Dataview.Relation();

			item.setKey(obj.relationKey);
			item.setIsvisible(obj.isVisible);
			item.setWidth(obj.width);
			item.setDateincludetime(obj.includeTime);
			item.setTimeformat(obj.timeFormat);
			item.setDateformat(obj.dateFormat);

			return item;
		},

		Filter: (obj: any) => {
			const item = new Model.Block.Content.Dataview.Filter();
			
			item.setId(obj.id);
			item.setRelationkey(obj.relationKey);
			item.setFormat(obj.format);
			item.setOperator(obj.operator);
			item.setCondition(obj.condition);
			item.setQuickoption(obj.quickOption);
			item.setValue(Encode.value(obj.value));
			item.setIncludetime(obj.includeTime);

			return item;
		},

		Sort: (obj: any) => {
			const item = new Model.Block.Content.Dataview.Sort();

			item.setId(obj.id);
			item.setRelationkey(obj.relationKey);
			item.setType(obj.type);
			item.setCustomorderList((obj.customOrder || []).map(Encode.value));
			item.setFormat(obj.format);
			item.setIncludetime(obj.includeTime);
			item.setEmptyplacement(obj.empty);

			return item;
		},

		View: (obj: I.View) => {
			obj = new M.View(UtilCommon.objectCopy(obj));
			
			const item = new Model.Block.Content.Dataview.View();

			item.setId(obj.id);
			item.setName(obj.name);
			item.setType(obj.type as any);
			item.setCoverrelationkey(obj.coverRelationKey);
			item.setGrouprelationkey(obj.groupRelationKey);
			item.setGroupbackgroundcolors(obj.groupBackgroundColors);
			item.setCoverfit(obj.coverFit);
			item.setCardsize(obj.cardSize as any);
			item.setHideicon(obj.hideIcon);
			item.setPagelimit(obj.pageLimit);
			item.setRelationsList(obj.relations.map(Mapper.To.ViewRelation));
			item.setFiltersList(obj.filters.map(Mapper.To.Filter));
			item.setSortsList(obj.sorts.map(Mapper.To.Sort));
			item.setDefaulttemplateid(obj.defaultTemplateId);
			item.setDefaultobjecttypeid(obj.defaultTypeId);

			return item;
		},

		PasteFile: (obj: any) => {
			const item = new Rpc.Block.Paste.Request.File();

			item.setName(obj.name);
			item.setLocalpath(obj.path);

			return item;
		},

		GroupOrder: (obj: any) => {
			const item = new Model.Block.Content.Dataview.GroupOrder();

			item.setViewid(obj.viewId);
			item.setViewgroupsList(obj.groups.map((it: any) => {
				const el = new Model.Block.Content.Dataview.ViewGroup();

				el.setGroupid(it.groupId);
				el.setIndex(it.index);
				el.setHidden(it.isHidden);
				el.setBackgroundcolor(it.bgColor);

				return el;
			}));

			return item;
		},

		ObjectOrder: (obj: any) => {
			const item = new Model.Block.Content.Dataview.ObjectOrder();

			item.setViewid(obj.viewId);
			item.setGroupid(obj.groupId);
			item.setObjectidsList(obj.objectIds);

			return item;
		},

		InternalFlag: (value: I.ObjectFlag) => {
			const item = new Model.InternalFlag();

			item.setValue(value as any);

			return item;
		},

		Snapshot: (obj: any) => {
			const item = new Rpc.Object.Import.Request.Snapshot();

			item.setId(obj.id);
			item.setSnapshot(obj.snapshot);

			return item;
		},

		ParticipantPermissionChange: (obj: any) => {
			const item = new Model.ParticipantPermissionChange();

			item.setIdentity(obj.identity);
			item.setPerms(obj.permissions);

			return item;
		},

	},

	Event: {

		Type (v: number): string {
			const V = Events.Event.Message.ValueCase;

			let t = '';
			if (v == V.ACCOUNTSHOW)					 t = 'AccountShow';
			if (v == V.ACCOUNTDETAILS)				 t = 'AccountDetails';
			if (v == V.ACCOUNTUPDATE)				 t = 'AccountUpdate';
			if (v == V.ACCOUNTCONFIGUPDATE)			 t = 'AccountConfigUpdate';
			if (v == V.ACCOUNTLINKCHALLENGE)		 t = 'AccountLinkChallenge';

			if (v == V.BLOCKADD)					 t = 'BlockAdd';
			if (v == V.BLOCKDELETE)					 t = 'BlockDelete';
			if (v == V.BLOCKSETFIELDS)				 t = 'BlockSetFields';
			if (v == V.BLOCKSETCHILDRENIDS)			 t = 'BlockSetChildrenIds';
			if (v == V.BLOCKSETBACKGROUNDCOLOR)		 t = 'BlockSetBackgroundColor';
			if (v == V.BLOCKSETTEXT)				 t = 'BlockSetText';
			if (v == V.BLOCKSETFILE)				 t = 'BlockSetFile';
			if (v == V.BLOCKSETLINK)				 t = 'BlockSetLink';
			if (v == V.BLOCKSETBOOKMARK)			 t = 'BlockSetBookmark';
			if (v == V.BLOCKSETALIGN)				 t = 'BlockSetAlign';
			if (v == V.BLOCKSETVERTICALALIGN)		 t = 'BlockSetVerticalAlign';
			if (v == V.BLOCKSETDIV)					 t = 'BlockSetDiv';
			if (v == V.BLOCKSETRELATION)			 t = 'BlockSetRelation';
			if (v == V.BLOCKSETLATEX)				 t = 'BlockSetLatex';
			if (v == V.BLOCKSETTABLEROW)			 t = 'BlockSetTableRow';
			if (v == V.BLOCKSETWIDGET)				 t = 'BlockSetWidget';

			if (v == V.BLOCKDATAVIEWVIEWSET)		 t = 'BlockDataviewViewSet';
			if (v == V.BLOCKDATAVIEWVIEWUPDATE)		 t = 'BlockDataviewViewUpdate';
			if (v == V.BLOCKDATAVIEWVIEWDELETE)		 t = 'BlockDataviewViewDelete';
			if (v == V.BLOCKDATAVIEWVIEWORDER)		 t = 'BlockDataviewViewOrder';

			if (v == V.BLOCKDATAVIEWTARGETOBJECTIDSET)	 t = 'BlockDataviewTargetObjectIdSet';
			if (v == V.BLOCKDATAVIEWISCOLLECTIONSET)	 t = 'BlockDataviewIsCollectionSet';

			if (v == V.BLOCKDATAVIEWRELATIONSET)	 t = 'BlockDataviewRelationSet';
			if (v == V.BLOCKDATAVIEWRELATIONDELETE)	 t = 'BlockDataviewRelationDelete';
			if (v == V.BLOCKDATAVIEWGROUPORDERUPDATE)	 t = 'BlockDataviewGroupOrderUpdate';
			if (v == V.BLOCKDATAVIEWOBJECTORDERUPDATE)	 t = 'BlockDataviewObjectOrderUpdate';

			if (v == V.SUBSCRIPTIONADD)				 t = 'SubscriptionAdd';
			if (v == V.SUBSCRIPTIONREMOVE)			 t = 'SubscriptionRemove';
			if (v == V.SUBSCRIPTIONPOSITION)		 t = 'subscriptionPosition';
			if (v == V.SUBSCRIPTIONCOUNTERS)		 t = 'SubscriptionCounters';
			if (v == V.SUBSCRIPTIONGROUPS)			 t = 'SubscriptionGroups';

			if (v == V.OBJECTREMOVE)				 t = 'ObjectRemove';
			if (v == V.OBJECTDETAILSSET)			 t = 'ObjectDetailsSet';
			if (v == V.OBJECTDETAILSAMEND)			 t = 'ObjectDetailsAmend';
			if (v == V.OBJECTDETAILSUNSET)			 t = 'ObjectDetailsUnset';
			if (v == V.OBJECTRELATIONSAMEND)		 t = 'ObjectRelationsAmend';
			if (v == V.OBJECTRELATIONSREMOVE)		 t = 'ObjectRelationsRemove';
			if (v == V.OBJECTRESTRICTIONSSET)		 t = 'ObjectRestrictionsSet';
			if (v == V.OBJECTCLOSE)					 t = 'objectClose';

			if (v == V.FILESPACEUSAGE)				 t = 'FileSpaceUsage';
			if (v == V.FILELOCALUSAGE)				 t = 'FileLocalUsage';
			if (v == V.FILELIMITREACHED)			 t = 'FileLimitReached';
			if (v == V.FILELIMITUPDATED)			 t = 'FileLimitUpdated';

			if (v == V.NOTIFICATIONSEND)			 t = 'NotificationSend';
			if (v == V.NOTIFICATIONUPDATE)			 t = 'NotificationUpdate';

			if (v == V.THREADSTATUS)				 t = 'ThreadStatus';

			if (v == V.PAYLOADBROADCAST)			 t = 'PayloadBroadcast';
			
			if (v == V.MEMBERSHIPUPDATE)			 t = 'MembershipUpdate';

			if (v == V.PROCESSNEW)					 t = 'ProcessNew';
			if (v == V.PROCESSUPDATE)				 t = 'ProcessUpdate';
			if (v == V.PROCESSDONE)					 t = 'ProcessDone';

			return t;
		},

		Data (e: any) {
			const type = Mapper.Event.Type(e.getValueCase());
			const fn = `get${UtilCommon.ucFirst(type)}`;

			return e[fn] ? e[fn]() : {};
		},

		AccountShow: (obj: any) => {
			return {
				account: Mapper.From.Account(obj.getAccount()),
			};
		},

		AccountUpdate: (obj: any) => {
			return {
				status: Mapper.From.AccountStatus(obj.getStatus()),
			};
		},

		AccountConfigUpdate: (obj: any) => {
			return {
				config: Mapper.From.AccountConfig(obj.getConfig()),
			};
		},

		AccountLinkChallenge: (obj: any) => {
			return {
				challenge: obj.getChallenge(),
			};
		},

		ThreadStatus: (obj: any) => {
			return {
				summary: Mapper.From.ThreadSummary(obj.getSummary()),
				cafe: Mapper.From.ThreadCafe(obj.getCafe()),
				accounts: (obj.getAccountsList() || []).map(Mapper.From.ThreadAccount),
			};
		},

		ObjectRelationsAmend: (obj: any) => {
			return {
				id: obj.getId(),
				relations: (obj.getRelationlinksList() || []).map(Mapper.From.RelationLink),
			};
		},

		ObjectRelationsRemove: (obj: any) => {
			return {
				id: obj.getId(),
				relationKeys: obj.getRelationkeysList() || [],
			};
		},

		ObjectRestrictionsSet: (obj: any) => {
			return {
				restrictions: Mapper.From.Restrictions(obj.getRestrictions()),
			};
		},

		FileSpaceUsage: (obj: any) => {
			return {
				spaceId: obj.getSpaceid(),
				bytesUsage: obj.getBytesusage(),
			};
		},

		FileLocalUsage: (obj: any) => {
			return {
				localUsage: obj.getLocalbytesusage(),
			};
		},

		FileLimitUpdated: (obj: any) => {
			return {
				bytesLimit: obj.getByteslimit(),
			};
		},

		BlockAdd: (obj: any) => {
			return {
				blocks: (obj.getBlocksList() || []).map(Mapper.From.Block),
			};
		},

		BlockDelete: (obj: any) => {
			return {
				blockIds: obj.getBlockidsList() || [],
			};
		},

		BlockSetChildrenIds: (obj: any) => {
			return {
				id: obj.getId(),
				childrenIds: obj.getChildrenidsList() || [],
			};
		},

		BlockSetFields: (obj: any) => {
			return {
				id: obj.getId(),
				fields: obj.hasFields() ? Decode.struct(obj.getFields()) : {},
			};
		},

		BlockSetLink: (obj: any) => {
			return {
				id: obj.getId(),
				targetBlockId: obj.hasTargetblockid() ? obj.getTargetblockid().getValue() : null,
				cardStyle: obj.hasCardstyle() ? obj.getCardstyle().getValue() : null,
				iconSize: obj.hasIconsize() ? obj.getIconsize().getValue() : null,
				description: obj.hasDescription() ? obj.getDescription().getValue() : null,
				relations: obj.hasRelations() ? obj.getRelations().getValueList() || [] : null,
				fields: obj.hasFields() ? Decode.struct(obj.getFields()) : null,
			};
		},

		BlockSetText: (obj: any) => {
			return {
				id: obj.getId(),
				text: obj.hasText() ? obj.getText().getValue() : null,
				style: obj.hasStyle() ? obj.getStyle().getValue() : null,
				checked: obj.hasChecked() ? obj.getChecked().getValue() : null,
				color: obj.hasColor() ? obj.getColor().getValue() : null,
				iconEmoji: obj.hasIconemoji() ? obj.getIconemoji().getValue() : null,
				iconImage: obj.hasIconimage() ? obj.getIconimage().getValue() : null,
				marks: obj.hasMarks() ? (obj.getMarks().getValue().getMarksList() || []).map(Mapper.From.Mark) : null,
			};
		},

		BlockSetDiv: (obj: any) => {
			return {
				id: obj.getId(),
				style: obj.hasStyle() ? obj.getStyle().getValue() : null,
			};
		},

		BlockDataviewTargetObjectIdSet: (obj: any) => {
			return {
				id: obj.getId(),
				targetObjectId: obj.getTargetobjectid(),
			};
		},

		BlockDataviewIsCollectionSet: (obj: any) => {
			return {
				id: obj.getId(),
				isCollection: obj.getValue(),
			};
		},

		BlockSetWidget: (obj: any) => {
			return {
				id: obj.getId(),
				layout: obj.hasLayout() ? obj.getLayout().getValue() : null,
				limit: obj.hasLimit() ? obj.getLimit().getValue() : null,
				viewId: obj.hasViewid() ? obj.getViewid().getValue() : null,
			};
		},

		BlockSetFile: (obj: any) => {
			return {
				id: obj.getId(),
				targetObjectId: obj.hasTargetobjectid() ? obj.getTargetobjectid().getValue() : null,
				type: obj.hasType() ? obj.getType().getValue() : null,
				style: obj.hasStyle() ? obj.getStyle().getValue() : null,
				state: obj.hasState() ? obj.getState().getValue() : null,
			};
		},

		BlockSetBookmark: (obj: any) => {
			return {
				id: obj.getId(),
				targetObjectId: obj.hasTargetobjectid() ? obj.getTargetobjectid().getValue() : null,
				state: obj.hasState() ? obj.getState().getValue() : null,
			};
		},

		BlockSetBackgroundColor: (obj: any) => {
			return {
				id: obj.getId(),
				bgColor: obj.getBackgroundcolor(),
			};
		},

		BlockSetAlign: (obj: any) => {
			return {
				id: obj.getId(),
				align: obj.getAlign(),
			};
		},

		BlockSetVerticalAlign: (obj: any) => {
			return {
				id: obj.getId(),
				align: obj.getVerticalalign(),
			};
		},

		BlockSetRelation: (obj: any) => {
			return {
				id: obj.getId(),
				key: obj.hasKey() ? obj.getKey().getValue() : null,
			};
		},

		BlockSetLatex: (obj: any) => {
			return {
				id: obj.getId(),
				text: obj.hasText() ? obj.getText().getValue() : null,
			};
		},

		BlockSetTableRow: (obj: any) => {
			return {
				id: obj.getId(),
				isHeader: obj.hasIsheader() ? obj.getIsheader().getValue() : null,
			};
		},

		BlockDataviewViewSet: (obj: any) => {
			return {
				id: obj.getId(),
				view: Mapper.From.View(obj.getView()),
			};
		},

		BlockDataviewViewUpdate: (obj: any) => {
			const ret = {
				id: obj.getId(),
				viewId: obj.getViewid(),
				fields: obj.hasFields() ? Mapper.From.ViewFields(obj.getFields()) : null,
			};

			const keys = [ 
				{ id: 'filter', field: 'filters', mapper: 'Filter' },
				{ id: 'sort', field: 'sorts', mapper: 'Sort' },
				{ id: 'relation', field: 'relations', mapper: 'ViewRelation' },
			];

			keys.forEach(key => {
				const items = obj[UtilCommon.toCamelCase(`get-${key.id}-list`)]() || [];

				ret[key.field] = [];

				items.forEach(item => {
					if (item.hasAdd()) {
						const op = item.getAdd();
						const afterId = op.getAfterid();
						const items = (op.getItemsList() || []).map(Mapper.From[key.mapper]);

						ret[key.field].push({ add: { afterId, items } });
					};

					if (item.hasMove()) {
						const op = item.getMove();
						const afterId = op.getAfterid();
						const ids = op.getIdsList() || [];

						ret[key.field].push({ move: { afterId, ids } });
					};

					if (item.hasUpdate()) {
						const op = item.getUpdate();

						if (op.hasItem()) {
							const item = Mapper.From[key.mapper](op.getItem());

							ret[key.field].push({ update: { id: op.getId(), item } });
						};
					};

					if (item.hasRemove()) {
						const op = item.getRemove();
						const ids = op.getIdsList() || [];

						ret[key.field].push({ remove: { ids } });
					};
				});
			});

			return ret;
		},

		BlockDataviewViewDelete: (obj: any) => {
			return {
				id: obj.getId(),
				viewId: obj.getViewid(),
			};
		},

		BlockDataviewViewOrder: (obj: any) => {
			return {
				id: obj.getId(),
				viewIds: obj.getViewidsList() || [],
			};
		},

		BlockDataviewRelationDelete: (obj: any) => {
			return {
				id: obj.getId(),
				relationKeys: obj.getRelationkeysList() || [],
			};
		},

		BlockDataviewRelationSet: (obj: any) => {
			return {
				id: obj.getId(),
				relations: (obj.getRelationlinksList() || []).map(Mapper.From.RelationLink),
			};
		},

		BlockDataviewGroupOrderUpdate: (obj: any) => {
			return {
				id: obj.getId(),
				groupOrder: obj.hasGrouporder() ? Mapper.From.GroupOrder(obj.getGrouporder()) : null,
			};
		},

		BlockDataviewObjectOrderUpdate: (obj: any) => {
			return {
				id: obj.getId(),
				groupId: obj.getGroupid(),
				viewId: obj.getViewid(),
				changes: (obj.getSlicechangesList() || []).map(it => {
					return {
						operation: it.getOp(),
						ids: it.getIdsList() || [],
						afterId: it.getAfterid(),
					};
				})
			};
		},

		ObjectDetailsSet: (obj: any) => {
			return {
				id: obj.getId(),
				subIds: obj.getSubidsList() || [],
				details: Decode.struct(obj.getDetails()),
			};
		},

		ObjectDetailsAmend: (obj: any) => {
			const details = {};

			(obj.getDetailsList() || []).forEach(it => {
				details[it.getKey()] = Decode.value(it.getValue());
			});

			return {
				id: obj.getId(),
				subIds: obj.getSubidsList() || [],
				details,
			};
		},

		ObjectDetailsUnset: (obj: any) => {
			return {
				id: obj.getId(),
				subIds: obj.getSubidsList() || [],
				keys: obj.getKeysList() || [],
			};
		},

		SubscriptionAdd: (obj: any) => {
			return {
				id: obj.getId(),
				afterId: obj.getAfterid(),
				subId: obj.getSubid(),
			};
		},

		SubscriptionRemove: (obj: any) => {
			return {
				id: obj.getId(),
				subId: obj.getSubid(),
			};
		},

		SubscriptionPosition: (obj: any) => {
			return {
				id: obj.getId(),
				afterId: obj.getAfterid(),
				subId: obj.getSubid(),
			};
		},

		SubscriptionCounters: (obj: any) => {
			return {
				total: obj.getTotal(),
				subId: obj.getSubid(),
			};
		},

		SubscriptionGroups: (obj: any) => {
			return {
				subId: obj.getSubid(),
				group: Mapper.From.BoardGroup(obj.getGroup()),
				remove: obj.getRemove(),
			};
		},

		NotificationSend: (obj: any) => {
			return {
				notification: Mapper.From.Notification(obj.getNotification()),
			};
		},

		NotificationUpdate: (obj: any) => {
			return {
				notification: Mapper.From.Notification(obj.getNotification()),
			};
		},

		PayloadBroadcast: (obj: any) => {
			return {
				payload: obj.getPayload(),
			};
		},

		MembershipUpdate: (obj: any) => {
			return {
				membership: Mapper.From.Membership(obj.getData()),
			};
		},

		ProcessNew: (obj: any) => {
			return {
				process: Mapper.From.Process(obj.getProcess()),
			};
		},

		ProcessUpdate: (obj: any) => {
			return {
				process: Mapper.From.Process(obj.getProcess()),
			};
		},

		ProcessDone: (obj: any) => {
			return {
				process: Mapper.From.Process(obj.getProcess()),
			};
		},

	},

};
