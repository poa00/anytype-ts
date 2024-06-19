import { I, S, U, J, Storage, analytics, Renderer, translate } from 'Lib';

class Survey {

	check (type: I.SurveyType) {
		const fn = `check${I.SurveyType[type]}`;

		if (this[fn]) {
			this[fn](type);
		};
	};

	show (type: I.SurveyType) {
		const prefix = `survey${type}`;

		S.Popup.open('confirm', {
			data: {
				title: translate(`${prefix}Title`),
				text: translate(`${prefix}Text`),
				textConfirm: translate(`${prefix}Confirm`),
				textCancel: translate(`${prefix}Cancel`),
				canConfirm: true,
				canCancel: true,
				onConfirm: () => this.onConfirm(type),
				onCancel: () => this.onSkip(type),
			}
		});

		analytics.event('SurveyShow', { type });
	};

	onConfirm (type: I.SurveyType) {
		const { account } = S.Auth;
		const t = I.SurveyType[type].toLowerCase();
		const param: any = {};

		switch (type) {
			default:
				param.complete = true;
				break;

			case I.SurveyType.Pmf:
				param.time = U.Date.now();
				break;
		};

		Storage.setSurvey(type, param);
		Renderer.send('urlOpen', U.Common.sprintf(J.Url.survey[t], account.id));
		analytics.event('SurveyOpen', { type });
	};

	onSkip (type: I.SurveyType) {
		const param: any = {};

		switch (type) {
			default:
				param.complete = true;
				break;

			case I.SurveyType.Pmf:
				param.cancel = true;
				param.time = U.Date.now();
				break;
		};

		Storage.setSurvey(type, param);
		analytics.event('SurveySkip', { type });
	};

	isComplete (type: I.SurveyType) {
		return Storage.getSurvey(type).complete;
	};

	getTimeRegister (): number {
		const profile = U.Space.getProfile();
		return Number(profile?.createdDate) || 0;
	};

	checkPmf (type: I.SurveyType) {
		const time = U.Date.now();
		const obj = Storage.getSurvey(type);
		const timeRegister = this.getTimeRegister();
		const lastCompleted = Number(obj.time || Storage.get('lastSurveyTime')) || 0;
		const lastCanceled = Number(obj.time || Storage.get('lastSurveyCanceled')) || 0;
		const week = 86400 * 7;
		const month = 86400 * 30;

		const registerTime = timeRegister <= time - week;
		const completeTime = obj.complete && registerTime && (lastCompleted <= time - month);
		const cancelTime = obj.cancel && registerTime && (lastCanceled <= time - month);

		// Show this survey to 5% of users
		if (this.checkRandSeed(5) && !completeTime) {
			Storage.setSurvey(type, { time });
			return;
		};

		if (!S.Popup.isOpen() && (cancelTime || !lastCompleted) && !completeTime) {
			this.show(type);
		};
	};

	checkRegister (type: I.SurveyType) {
		const timeRegister = this.getTimeRegister();
		const isComplete = this.isComplete(type);
		const surveyTime = timeRegister && ((U.Date.now() - 86400 * 7 - timeRegister) > 0);

		if (!isComplete && surveyTime && !S.Popup.isOpen()) {
			this.show(type);
		};
	};

	checkDelete (type: I.SurveyType) {
		const isComplete = this.isComplete(type);

		if (!isComplete) {
			this.show(type);
		};
	};

	checkObject (type: I.SurveyType) {
		const timeRegister = this.getTimeRegister();
		const isComplete = this.isComplete(type);

		if (isComplete || !timeRegister) {
			return;
		};

		U.Data.search({
			filters: [
				{ operator: I.FilterOperator.And, relationKey: 'layout', condition: I.FilterCondition.In, value: U.Object.getPageLayouts() },
				{ operator: I.FilterOperator.And, relationKey: 'createdDate', condition: I.FilterCondition.Greater, value: timeRegister + 86400 * 3 }
			],
			limit: 50,
		}, (message: any) => {
			if (!message.error.code && (message.records.length >= 50)) {
				this.show(type);
			};
		});
	};

	checkShared (type: I.SurveyType) {
		const isComplete = this.isComplete(type);
		if (isComplete || this.isComplete(I.SurveyType.Multiplayer)) {
			return;
		};

		const { account } = S.Auth;
		const check = U.Space.getList().filter(it => it.isShared && (it.creator == U.Space.getParticipantId(it.targetSpaceId, account.id)));
		if (!check.length) {
			return;
		};

		this.show(type);
	};

	checkMultiplayer (type: I.SurveyType) {
		const isComplete = this.isComplete(type);
		const timeRegister = this.getTimeRegister();
		const surveyTime = timeRegister && (timeRegister <= U.Date.now() - 86400 * 7);

		if (isComplete || this.isComplete(I.SurveyType.Shared) || !surveyTime) {
			return;
		};

		if (this.checkRandSeed(30)) {
			this.show(type);
		};
	};

	checkRandSeed (percent: number) {
		const randSeed = 10000000;
		const rand = U.Common.rand(0, randSeed);

		return rand < randSeed * percent / 100;
	};

};

export default new Survey();