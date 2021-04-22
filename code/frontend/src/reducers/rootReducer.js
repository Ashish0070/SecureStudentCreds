import { produce, original } from "immer";
import { act } from "react-dom/test-utils";

const initState = {
    uploaderOpen: false,
    invoicesProcessed: 0,
    userID: '0fcc0cae-1870-4307-b949-7ed90788b878',
    files: [
        { studentAddress: '0x93EC21b173d25CEd8777d8D9b2DF9bbc55071D6d', filesUploaded: '12', view: '0x93EC21b173d25CEd8777d8D9b2DF9bbc55071D6d' },
        { studentAddress: 'dasdadasd', filesUploaded: '1' },
        { studentAddress: 'adsadas', filesUploaded: '15' },
    ],
    preview: {
        fileID: null,
        show: false
    },
    support: [],
    supportDisplay: {
        display: false,
        url: null
    },
    userAddress: null,
    studentFiles: [
        { fileName: 'file1', desc: '', fileUrl: '' },
        { fileName: 'file2', desc: '', fileUrl: '' },
        { fileName: 'file3', desc: '', fileUrl: '' },
    ],
    appLoading: true,
    filesUploaded: {},
    students: [],
    studentFilesCount: 0,
    org: ''
}

var files;
var newFiles;

const rootReducer = produce((draft, action) => {
    switch (action.type) {
        case "TOGGLE_UPLOADER":
            draft.uploaderOpen = action.toggle;
            break;
        case "ADD_FILE":
            files = original(draft).files;
            console.log(files);
            newFiles = [{
                id: action.fileID,
                filename: action.file.meta.name,
                status: false,
                fraud: '-',
                date: new Date().toLocaleDateString(),
                download: null
            }, ...files];
            draft.files = newFiles;
            break;
        case "UPDATE_FILE":
            let fileID = action.fileData.fileID;
            let fraud = action.fileData.fraud;
            let url = action.fileData.link;
            let processedDetails = action.fileData.processedDetails;
            files = original(draft).files;
            files.map((file, index) => {
                if (file.id == fileID) {
                    draft.files[index].fraud = fraud;
                    draft.files[index].download = url;
                    draft.files[index].status = true;
                    draft.files[index].processedDetails = processedDetails;
                }
            });
            draft.invoicesProcessed = original(draft).invoicesProcessed + 1;
            break;
        case "SHOW_PREVIEW":
            draft.preview.show = true;
            draft.preview.link = action.link;
            break;
        case "CLOSE_PREVIEW":
            draft.preview.show = false;
            break;
        case "SET_SUPPORT":
            draft.support = action.supportArray;
            break;
        case "DISPLAY_INVOICE":
            draft.support = action.supportArray;
            break;
        case "DISPLAY_SUPPORT":
            draft.supportDisplay = {
                display: true,
                url: action.url
            }
            break;
        case "HIDE_SUPPORT":
            draft.supportDisplay = {
                display: false,
                url: null
            }
            break;
        case "SET_USER_ADDRESS":
            draft.userAddress = action.userAddress;
            draft.appLoading = true;
            break;
        case "SET_ORGANIZATION":
            draft.org = action.org;
            break;
        case "SET_APP_LOADING":
            draft.appLoading = action.state;
            break;
        case "CHANGE_FILE_NAME":
            draft.filesUploaded[action.id].fileName = action.value;
            break;
        case "CHANGE_FILE_DESC":
            console.log(action.value);
            draft.filesUploaded[action.id].fileDesc = action.value;
            break;
        case "ADD_FILE_NEW":
            draft.filesUploaded[action.id] = {};
            break;
        case "SET_STUDENT_FILES":
            draft.studentFiles = action.studentFiles;
            break;
        case "SET_KEY":
            draft[action.key] = action.value;
            break;
    }
}, initState);


export default rootReducer;