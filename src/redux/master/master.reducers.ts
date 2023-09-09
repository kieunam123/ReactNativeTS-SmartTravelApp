import { IBusinessInfo, ICityLatLong, ICustomerDetail, ICustomerTmpInfo, IFarmItem, IGoogleResult, IImageResponse, ILastCheckinResponse, ISearchInformation, IUserLatLong } from '../../apis/types.service';
import {DropdownItemType} from '../../commons/types';
import {removeUnicode} from '../../helpers/UtilitiesHelper';
import {IMasterState, MasterActionsType, Types} from './master.types';
import {currentDate} from './../../configs/initializeVariable';

const customerModel: ICustomerDetail = {
  CUSTOMERID: '',
  CUSTNAME: '',
  ADDRESS: '',
  TEL: '',
  IDCARD: '',
  IDCARDDATE: currentDate,
  ISBUSINESS: '',
  USERCREATE: '',
  CREATEDATE: currentDate,
  ACTIVE: '',
  EMAILADDRESS: '',
  NOTRECEIVEINVOICE: '',
  ACTION_TYPE: '',
  APPROVED_BY: '', 
  APPROVED_DATE: '', 
  ASSET: '', 
  BANK_ACCOUNT: '', 
  BRANCHID: '', 
  BUSINESS_TYPE: '', 
  CAPACITY: '', 
  CHECKIN_ID: '', 
  COMMUNE_ID: '', 
  CREATED_BY: '', 
  CREATED_DATE: currentDate, 
  CUSTIDCARD: '',
  CUSTIDCARDDATE: currentDate,
  CUSTOMER_BUSINESS: '', 
  DISTRICT_ID: '', 
  EDOC_ID: 0, 
  EMAIL: '', 
  IS_APPROVED: '', 
  IS_INSIGNING: '', 
  NAME: '', 
  OTHERS: '',
  OWNER_ADDRESS: '',
  OWNER_NAME: '',
  OWNER_PHONE: '', 
  PHONE_NUMBER: '', 
  PROVINCE_ID: '', 
  SIGN_STATUS: 0,
  STREET_ADDRESS: '', 
  TAX_CODE: '', 
  TMP_CODE: 0, 
  WARRANTY: '',
  ListBranch: [],
  BRANCHIDLIST: ``,
}

const knowledge_graph: ISearchInformation = {
    title: '',
    type: '',
    header_images: [
      {
        image: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
        source: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
      }
    ],
    description: '',
    local_map: {
      image: '',
      link: '',
    },
    weather: '',
    population: '',
    area_code: '',
    climate: '',
    postal_code: '',
    region: '',
    founded: '',
    buttons: [],
  }

const initialState: IMasterState = {
  userMenus: [],
  userOfficeS: [],
  userDepartmentS: [],
  customers: [],
  customersTmp: [],
  customerModel: customerModel,
  customerDropdownData: [],
  locations: [],
  saleLocations: [],
  locationsOfUser: [],
  locationsDropdownData: [],
  productsUnit: [],
  productsDropdownData: [],
  prices: [],
  customerBalances: [],
  discountTypeDropdownData: [
    {
      label: 'Chiết khấu nhập thường',
      value: 0,
      keySearch: 'chiet khau tra sau',
    },
    {
      label: 'Chiết khấu nhận nhánh khác (CNDN)',
      value: 1,
      keySearch: 'cndn'
    }
    // {label: 'Write Off', value: 1, keySearch: 'write off'},
  ],
  unitsCustomerDropdownData: [],
  unitsOfCustomer: [],
  unitsSale: [],
  products: [],
  userMenuIds: [],
  isSubmitSuccess: false,
  currentScreen: '',
  farmList: [],
  checkingID: 0,
  checkoutID: 0,
  checkingData: [],
  checkingDataDetail: [],
  checkingImg: '',
  imageID: '',
  isCheckOut: true,
  QRcode: '',
  FarmID: '',
  lastCheckinResponse: [],
  AllReport: [],
  cityLatLong: [],
  Information: knowledge_graph,
  InformationButtons: [],
  GoogleResult: {
    knowledge_graph: {
      header_images: [
        {
          image: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
          source: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
        }
      ],
      local_map: {
        image: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
        link: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
      },
    }
  },
  TopSights: {},
  ImgurResult: {
    data : {
      link: ''
    },
    success: false,
    status: 0
  },
  GoogleImgResult: {
    knowledge_graph: [
      {
        thumbnail: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
        images: [
          {
            link: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
          }
        ]
      }
    ]
  },
  ChatGPTResponse: [],
};

export default function MasterReducers(
  state = initialState,
  action: MasterActionsType,
): IMasterState {
  switch (action.type) {
    case Types.MASTER_CHANGE_IS_SUBMIT_STATUS: {
      const {isResult, screen} = action.payload;
      const strScreen = screen ?? state.currentScreen;
      return {...state, isSubmitSuccess: isResult, currentScreen: strScreen};
    }
    case Types.MASTER_FETCH_OFFICE_BY_USER_SUCCESS: {
      return {...state, userOfficeS: action.payload};
    }
    case Types.MASTER_GET_CITY_LATLONG_SUCCESS: {
      return {
        ...state,
        cityLatLong: action.payload
      }
    }

    case Types.MASTER_GET_IMG_URL_SUCCESS: {
      const {ImgurResult} = action.payload
      return {
        ...state,
        ImgurResult: ImgurResult,
      }
    }

    case Types.MASTER_GET_GOOGLE_IMG_RESULT_SUCCESS: {
      const {GoogleImgResult} = action.payload
      return {
        ...state,
        GoogleImgResult: GoogleImgResult,
      }
    }

    case Types.MASTER_GET_GOOGLE_RESULT_SUCCESS: {
      const {GoogleResult} = action.payload
      return {
        ...state,
        GoogleResult: GoogleResult,
      }
    }

    case Types.MASTER_SEND_MESSAGES_TO_CHATGPT_SUCCESS: {
      return {
        ...state,
        ChatGPTResponse: action.payload,
      }
    }

    case Types.MASTER_GET_INFORMATION_RESULT_SUCCESS: {
      const {Information} = action.payload
      return {
        ...state,
        Information: Information,
      }
    }

    case Types.MASTER_GET_TOPSIGHTS_SUCCESS: {
      const {TopSights} = action.payload
      return {
        ...state,
        TopSights: TopSights,
      }
    }

    case Types.MASTER_GET_INFORMATION_BUTTONS_SUCCESS: {
      return {
        ...state,
        InformationButtons: action.payload
      }
    }

    case Types.MASTER_FETCH_DEPARTMENT_BY_USER_SUCCESS: {
      return {...state, userDepartmentS: action.payload};
    }
    case Types.MASTER_FETCH_CUSTOMERS_SUCCESS: {
      return {...state, customers: action.payload};
    }

    case Types.MASTER_GET_CHECKING_IMAGE_SUCCESS: {
      const {checkingImage, isCheckOut, imageID} = action.payload
      return {
        ...state,
        checkingImg: checkingImage,
        isCheckOut: isCheckOut,
        imageID: imageID,
      }
    }


    case Types.MASTER_GET_LAST_CHECKID_SUCCESS: {
      return {
        ...state,
        lastCheckinResponse: action.payload,
      }
    }

    case Types.MASTER_GENERATE_QR_SUSCCESS: {
      const {FarmID,QRcode} = action.payload;
      return {
        ...state,
        QRcode: QRcode,
        FarmID: FarmID,
      }
    }

    case Types.MASTER_CREATE_CHECKING_SUCCESS: {
      const {checkingId} = action.payload;
      return {
        ...state,
        checkingID: checkingId,
      }
    }

    case Types.MASTER_CREATE_CHECKOUT_SUCCESS: {
      const {checkoutId} = action.payload;
      return {
        ...state,
        checkoutID: checkoutId,
      }
    }

    case Types.MASTER_FETCH_CUSTOMERS_TMP_SUCCESS: {
      return {...state, customersTmp: action.payload};
    }

    case Types.MASTER_FETCHING_FARMLIST_SUCCESS: {
      const {farmlist} = action.payload
      return {
        ...state,
        farmList: farmlist,
      }
    }

    case Types.MASTER_FETCH_CHECKING_HISTORY_SUCCESS: {
      return {
        ...state,
        checkingData: action.payload,
      };
    }

    case Types.MASTER_FETCH_ALL_REPORT_SUCCESS: {
      return {
        ...state,
        AllReport: action.payload,
      };
    }

    case Types.MASTER_FETCH_HISTORY_DETAIL_SUCCESS: {
      return {
        ...state,
        checkingDataDetail: action.payload,
      }
    }

    case Types.MASTER_UPDATE_CUSTOMER_DROPDOWN_DATA: {
      return {...state, customerDropdownData: action.payload};
    }
    case Types.MASTER_FETCH_LOCATION_BY_UNIT_SUCCESS: {
      return {...state, locations: action.payload};
    }
    case Types.MASTER_GET_SALE_LOCATION_SUCCESS: {
      const {locations} = action.payload;
      return {...state, saleLocations: locations};
    }
    case Types.MASTER_UPDATE_LOCATION_DROPDOWN_DATA: {
      return {...state, locationsDropdownData: action.payload};
    }
    case Types.MASTER_UPDATE_CUSTOMER: {
      return {...state, customerModel: action.payload!}
    }
    case Types.MASTER_FETCH_PRODUCTS_BY_UNIT_SUCCESS: {
      const products = action.payload;
      const dropdownData: DropdownItemType[] = products.map((item) => {
        const dropDownItem: DropdownItemType = {
          label: item.Name,
          value: item.ID,
          keySearch: `${removeUnicode(item.Name)} ${item.ID}`,
        };
        return dropDownItem;
      });
      return {
        ...state,
        productsUnit: products,
        productsDropdownData: dropdownData,
      };
    }
    case Types.MASTER_GET_SWINE_PRICE_BY_CUST_PRODUCT_SUCCESS: {
      return {...state, prices: action.payload};
    }
    case Types.MASTER_GET_CUSTOMER_BALANCES_SUCCESS: {
      return {...state, customerBalances: action.payload};
    }
    case Types.MASTER_GET_UNITS_OF_CUSTOMER_SUCCESS: {
      const {units, unitsDropdownData} = action.payload;
      return {
        ...state,
        unitsOfCustomer: units,
        unitsCustomerDropdownData: unitsDropdownData,
      };
    }
    case Types.MASTER_GET_LOCATIONS_BY_USER_SUCCESS: {
      const {locations} = action.payload;
      return {...state, locationsOfUser: locations};
    }
    case Types.MASTER_GET_MENU_BY_USER_SUCCESS: {
      const {menus, userMenuIds} = action.payload;
      return {...state, userMenus: menus, userMenuIds};
    }
    case Types.MASTER_GET_SALE_UNITS_SUCCESS: {
      const {units} = action.payload;
      return {...state, unitsSale: units};
    }
    case Types.MASTER_GET_ALL_PRODUCTS_SUCCESS: {
      const {products} = action.payload;
      return {...state, products};
    }
    default:
      return state;
  }
}
