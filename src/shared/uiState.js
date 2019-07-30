export const UISTATE_FETCHED = 'fetched'
export const UISTATE_FETCH_FAILED = 'fetch_failed'
export const UISTATE_FETCHING = 'fetching'
export const UISTATE_SAVED = 'saved'
export const UISTATE_SAVE_FAILED = 'save_failed'
export const UISTATE_SAVING = 'saving'

const uiStateGet = actionType => {
	if (actionType.endsWith('SUCCESS')) {
		return UISTATE_FETCHED
	}
	if (actionType.endsWith('ERROR')) {
		return UISTATE_FETCH_FAILED
	}
	return UISTATE_FETCHING
}

const uiStatePost = actionType => {
	if (actionType.endsWith('SUCCESS')) {
		return UISTATE_SAVED
	}
	if (actionType.endsWith('ERROR')) {
		return UISTATE_SAVE_FAILED
	}
	return UISTATE_SAVING
}

export function resolveUiState(actionType) {
	const isPost = actionType.startsWith('SAVE_') || actionType.startsWith('SUBMIT_') || actionType.startsWith('SEND_');

	return isPost ? uiStatePost(actionType) : uiStateGet(actionType);
}