import HttpError from '../../exceptions/HttpError'

export interface IHttpErrorFabric {
	createBadRequest(message: string): HttpError
	createInternalServerError(message: string): HttpError
}
