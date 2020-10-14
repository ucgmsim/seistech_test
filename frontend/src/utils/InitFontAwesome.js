import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLink,
  faPowerOff,
  faUser,
  faDownload,
  faSpinner,
  faTrash,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";

function InitFontAwesome() {
  library.add(faLink);
  library.add(faUser);
  library.add(faPowerOff);
  library.add(faDownload);
  library.add(faSpinner);
  library.add(faTrash);
  library.add(faCaretDown);
  library.add(faCaretUp);
}

export default InitFontAwesome;
