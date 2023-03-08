import MicrosoftGraph from '@models/MicrosoftGraph';
import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import ExcelJs from 'exceljs';

interface ILogin {
  token_type: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
}

interface ISite {
  createdDateTime: string;
  description: string;
  id: string;
  lastModifiedDateTime: string;
  name: string;
  webUrl: string;
  displayName: string;
  siteCollection: {
    hostname: string;
  };
}

interface IDrive {
  value: [
    {
      createdDateTime: string;
      description: string;
      id: string;
      lastModifiedDateTime: string;
      name: string;
      webUrl: string;
      driveType: string;
    },
  ];
}

export const generateGraphAccessToken = async () => {
  const microsoftGraph = await MicrosoftGraph.findOne();
  let accessToken = microsoftGraph?.accessToken;

  // if accesstoken expires or not exists create a new one
  if (!microsoftGraph || !accessToken || new Date() > new Date(microsoftGraph.accessTokenExpiryTime)) {
    const formdata = new FormData();
    formdata.append('grant_type', 'client_credentials');
    formdata.append('client_id', process.env.graph_clientId);
    formdata.append('client_secret', process.env.graph_clientSecret);
    formdata.append('scope', 'https://graph.microsoft.com/.default');

    const response = await axios.post<ILogin>(`https://login.microsoftonline.com/${process.env.tenantId}/oauth2/v2.0/token`, formdata);
    accessToken = response.data.access_token;

    const accessTokenExpiryTime = new Date();
    accessTokenExpiryTime.setSeconds(accessTokenExpiryTime.getSeconds() + response.data.expires_in);

    if (microsoftGraph) {
      microsoftGraph.accessToken = accessToken;
      microsoftGraph.accessTokenExpiryTime = accessTokenExpiryTime;
      await microsoftGraph.update();
    } else {
      await new MicrosoftGraph({ accessToken, accessTokenExpiryTime }).save();
    }
  }

  return accessToken;
};

export const generateSiteId = async () => {
  const accessToken = await generateGraphAccessToken();
  const microsoftGraph = await MicrosoftGraph.findOne();

  let siteId: string;

  if (microsoftGraph?.siteId) siteId = microsoftGraph.siteId;
  else {
    const response = await axios.get<ISite>(
      `https://graph.microsoft.com/v1.0/sites/${process.env.tenantName}.sharepoint.com:/sites/${process.env.siteName}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const siteString = response.data.id;
    [, siteId] = siteString.split(',');

    if (microsoftGraph) {
      microsoftGraph.siteId = siteId;
      await microsoftGraph.save();
    }
  }

  return siteId;
};

export const generateDriveId = async () => {
  const accessToken = await generateGraphAccessToken();
  const siteId = await generateSiteId();
  const microsoftGraph = await MicrosoftGraph.findOne();

  let driveId: string;

  if (microsoftGraph?.driveId) {
    driveId = microsoftGraph.driveId;
  } else {
    const response = await axios.get<IDrive>(`https://graph.microsoft.com/v1.0/sites/${siteId}/drives`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    driveId = response.data.value[0].id;

    if (microsoftGraph) {
      microsoftGraph.driveId = driveId;
      await microsoftGraph.save();
    }
  }

  return driveId;
};

interface UploadToDriveOptions {
  filename: string;
  extension: string;
  filepath: string;
  buffer: ExcelJs.Buffer;
}

export const uploadItemToDrive = async (options: UploadToDriveOptions) => {
  const driveId = await generateDriveId();
  const accessToken = await generateGraphAccessToken();

  const config: AxiosRequestConfig = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `https://graph.microsoft.com/v1.0/drives/${driveId}/root:${options.filepath}/${options.filename}.${options.extension}:/content`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: options.buffer,
  };

  await axios(config);
};
