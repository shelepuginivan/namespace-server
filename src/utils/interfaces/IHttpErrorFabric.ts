import HttpError from '../../exceptions/HttpError'

export interface IHttpErrorFabric {
	createBadRequest(message: string): HttpError
	createForbidden(message: string): HttpError
	createInternalServerError(message: string): HttpError
}
