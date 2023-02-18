import {IFileService} from '../utils/interfaces/IFileService'
import * as path from 'path'

class FileService implements IFileService {
	downloadFile(pathToFile: string): string {
		return path.join(process.env.DISKSPACE_DIRECTORY as string, pathToFile)
	}
}

export default new FileService()
