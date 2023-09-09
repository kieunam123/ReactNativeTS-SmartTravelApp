import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { getCityLatLong, getGoogleImgResult, getGoogleResult, PostImgAndGetUrl, SendMessageToChatGPT } from "./../../apis/master.service";
import { IChatGPTCall, IChatGPTResponse, ICityLatLong, IGoogleImgResult, IGoogleResult, IHeaderImageInfo, IImgurResult } from "./../../apis/types.service";
import ScreenType from "./../../navigations/screen.constant";
import { onSagaNavigate, safe } from "../saga.helpers";
import MasterActions from "./master.actions";
import { IGetCityLatLong, IGetGoogleImgResult, IGetGoogleResult, IGetImgUrl, ISendMessagesToChatGPT, Types } from "./master.types";

/** ================== WORKER ==================== */
const googleResult = {
  search_metadata: {
    id: '',
    status: '',
    json_endpoint: '',
    created_at: '',
    processed_at: '',
    google_url: '',
    raw_html_file: '',
    total_time_taken: 0,
  },
  search_parameters: {
    engine: '',
    q: '',
    gl: '',
    device: '',
  },
  knowledge_graph: {
    title: 'No information found!',
    type: '',
    header_images: [
      {
        image: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
        source: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
      }
    ],
    description: '',
    local_map: {
      image: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
      link: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
    },
    weather: '',
    population: '',
    area_code: '',
    climate: '',
    postal_code: '',
    region: '',
    founded: '',
    buttons: [],
  },
  top_sights: {
    sights: [
      {
        title: '',
        link: '',
        rating: 0,
        reviews: 0,
        thumbnail: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
        description: ''
      }
    ],
    show_more_link: ''
  },
  inline_images: [],
  organic_results: [],
  lat: 0,
  long: 0,
}

const GoogleImgResult = {
  knowledge_graph: [
    {
      title: '',
      subtitle: '',
      thumbnail: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
      images: [
        {
          title: '',
          link: 'https://www.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg',
        }
      ]
    }
  ]
}

function* handleGetCityLatLong({ payload }: IGetCityLatLong) {
  const { cityname } = payload
  const response: ICityLatLong[] = yield call(
    getCityLatLong,
    cityname,
  )
  if (response[0] !== undefined) {
    yield put(MasterActions.getCityLatLongSuccess(response));
    // console.log({response});
  } else {
    yield put(MasterActions.getCityLatLongSuccess([]))
    throw new Error('City not found! Please check spelling mistake.\nKhông tìm thấy thành phố, vui lòng gõ đúng tên thành phố')
  }
}

function* handleGetGoogleResult({ payload }: IGetGoogleResult) {
  const { query, lang } = payload
  const response: IGoogleResult = yield call(
    getGoogleResult,
    query,
    lang,
  )
  if (!response.error) {
    yield put(MasterActions.getGoogleResultSuccess(response));
    if (response.knowledge_graph) {
      yield put(MasterActions.getInformationSuccess(response.knowledge_graph));
      if (response.top_sights) {
        yield put(MasterActions.getTopSights(response.top_sights));
      } else {
        yield put(MasterActions.getTopSights(googleResult.top_sights));
      }
    } else {
      yield put(MasterActions.getInformationSuccess(googleResult.knowledge_graph));
    }
  }
}

function* handleGetGoogleImgResult({ payload }: IGetGoogleImgResult) {
  const { imglink, lang } = payload
  const response: IGoogleImgResult = yield call(
    getGoogleImgResult,
    imglink,
    lang,
  );
  if (response.knowledge_graph) {
    if (response.knowledge_graph[0].title) {
      yield put(MasterActions.getGoogleImgResultSuccess(response));
    } else {
      yield put(MasterActions.getGoogleImgResultSuccess({ ...response.knowledge_graph, ...GoogleImgResult }));
    }
    onSagaNavigate({isNavigate: true, screen: ScreenType.Master.ImageResultScreen});
  } else {
    if (response.visual_matches) {
      yield put(MasterActions.getGoogleImgResultSuccess({ ...response.visual_matches, ...GoogleImgResult }));
      onSagaNavigate({isNavigate: true, screen: ScreenType.Master.ImageResultScreen});
    } else {
      yield put(MasterActions.getGoogleImgResultSuccess(GoogleImgResult));
      throw new Error('No result matches your image.\nKhông tìm thấy kết quả với hình ảnh của bạn.')
    }
  }
}

function* handleGetImgUrl({ payload: IImgModel }: IGetImgUrl) {
  const response: IImgurResult = yield call(
    PostImgAndGetUrl,
    IImgModel
  );
  if (response.success) {
    yield put(MasterActions.getImgUrlSuccess(response));
  } else {
    yield put(MasterActions.getImgUrlSuccess({
      data: { link: 'https://mona.media/wp-content/uploads/2021/07/404-error.png' },
      success: false,
      status: 0
    }));
    throw new Error('Cannot generate image URL. Please try again!')
  }

}

function* handleSendMessageToChatGPT({payload}: ISendMessagesToChatGPT) {
  const {prompt, max_tokens} = payload
  const response: IChatGPTCall = yield call(
    SendMessageToChatGPT,
    prompt,
    max_tokens
  );
  if(response.choices !== undefined){
    yield put(MasterActions.sendMessagesToChatGPTSuccess(response.choices))
  }
}


/** ========== WATCHER ================= */

function* watchHandleGetCityLatLong() {
  yield takeEvery(Types.MASTER_GET_CITY_LATLONG, safe(handleGetCityLatLong));
}

function* watchGetGoogleResult() {
  yield takeEvery(Types.MASTER_GET_GOOGLE_RESULT, safe(handleGetGoogleResult));
}

function* watchHandleGetImgUrl() {
  yield takeEvery(Types.MASTER_GET_IMG_URL, safe(handleGetImgUrl));
}

function* watchHandleGetGoogleImgResult() {
  yield takeEvery(Types.MASTER_GET_GOOGLE_IMG_RESULT, safe(handleGetGoogleImgResult));
}

function* watchHandleSendMessageToChatGPT() {
  yield takeEvery(Types.MASTER_SEND_MESSAGES_TO_CHATGPT, safe(handleSendMessageToChatGPT));
}

export default function* masterSaga() {
  yield all([
    fork(watchHandleGetCityLatLong),
    fork(watchGetGoogleResult),
    fork(watchHandleGetImgUrl),
    fork(watchHandleGetGoogleImgResult),
    fork(watchHandleSendMessageToChatGPT),
  ])
}
