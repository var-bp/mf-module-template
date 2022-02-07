export interface IUsersListData {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface IUsersList {
  fetching: boolean;
  data: IUsersListData[] | [];
  error: any;
}

interface IInitialState {
  usersList: IUsersList;
}

const initialState: IInitialState = {
  usersList: {
    fetching: false,
    data: [],
    error: undefined,
  },
};

export default initialState;
