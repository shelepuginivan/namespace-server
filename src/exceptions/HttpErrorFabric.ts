import {IHttpErrorFabric} from '../utils/interfaces/IHttpErrorFabric'
import HttpError from './HttpError'

class HttpErrorFabric implements IHttpErrorFabric {
	createBadRequest(message: string): HttpError {
		return new HttpError(400, message)
	}

	createForbidden(message: string): HttpError {
		return new HttpError(403, message)
	}

	createInternalServerError(message: string): HttpError {
		return new HttpError(500, message)
	}
}

export default new HttpErrorFabric()
