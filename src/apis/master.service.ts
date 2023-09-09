import { getWithUrl, postWithUrl } from './../helpers/HttpHelpers';
import {
  AI_API,
  API_URL,
  SERPAPI_URL,
  SERPAPI_APIKEY,
  IMGUR_API,
  IMGUR_ACCESSTOKEN,
  CHATGPT_API,
  CHATGPT_ACCESSTOKEN
  } from '../configs/strings';
import { IChatGPTCall, IChatGPTResponse, ICityLatLong, IGoogleImgResult, IGoogleResult, IImageModel, IImgModel, IImgurResult } from './types.service';

  export const getCityLatLong = async (
    cityname: string
  ): Promise<ICityLatLong> => {
    return getWithUrl<ICityLatLong>(
      AI_API,
      `search`,
      {q: cityname, format: 'json'},
    );
  };  

  export const getGoogleResult = async (
    query: string,
    lang: string,
  ): Promise<IGoogleResult> => {
    return getWithUrl<IGoogleResult>(
      SERPAPI_URL,
      `search`,
      {q: `${query}`,gl:`vn`, api_key: SERPAPI_APIKEY}
    );
  };

  export const getGoogleImgResult = async (
    imglink: string,
    lang: string,
  ): Promise<IGoogleImgResult> => {
    return getWithUrl<IGoogleImgResult>(
      SERPAPI_URL,
      `search.json`,
      {url: imglink, hl: lang === 'us' ? 'en' : 'vi', api_key: SERPAPI_APIKEY, engine: 'google_lens'}
    );
  };

  export const PostImgAndGetUrl = async (
    ImgModel: IImgModel,
  ): Promise<IImgurResult> => {
    return postWithUrl<IImgurResult>(
      IMGUR_API,
      '',
      ImgModel,
      undefined,
      `Client-ID ${IMGUR_ACCESSTOKEN}`,
    );
  };

  export const SendMessageToChatGPT = async (
    prompt: string,
    max_tokens: number,
  ): Promise<IChatGPTCall> => {
    return postWithUrl<IChatGPTCall>(
      CHATGPT_API,
      '',
      {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: max_tokens,
        temperature: 0
      },
      undefined,
      `Bearer ${CHATGPT_ACCESSTOKEN}`
    )
  }



  