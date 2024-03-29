export default function callApiMiddleware({ dispatch, getState }) {
    return next => action => {
        const { types, callApi, shouldCallApi = () => true, payload = {}, onSuccess = () => true } = action

        if (!types) {
            // Normal action: pass it on
            return next(action)
        }

        if (
            !Array.isArray(types) ||
            types.length !== 3 ||
            !types.every(type => typeof type === 'string')
        ) {
            throw new Error('Expected an array of three string types.')
        }

        if (typeof callApi !== 'function') {
            throw new Error('Expected callApi to be a function.')
        }

        if (!shouldCallApi(getState())) {
            return
        }

        const [requestType, successType, failureType] = types

        dispatch(
            Object.assign({}, payload, {
                type: requestType
            })
        )

        return callApi().then(
            response => {
                dispatch(
                    Object.assign({}, payload, {
                        response,
                        type: successType
                    })
                );
                onSuccess(response)},
            error =>
                dispatch(
                    Object.assign({}, payload, {
                        error: error.message,
                        type: failureType
                    })
                )
            )
    }
}