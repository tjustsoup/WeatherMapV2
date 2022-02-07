import React from 'react';
import { Provider, useDispatch } from "react-redux";
import { configureStore } from '@reduxjs/toolkit'
import { taskMiddleware } from "react-palm/tasks";

import KeplerGl from "kepler.gl";
import { addDataToMap } from "kepler.gl/actions";
import keplerGlReducer from "kepler.gl/reducers";
import {processGeojson} from 'kepler.gl/processors';

import useSwr from "swr";

const store = configureStore({
  reducer: {
    keplerGl: keplerGlReducer
  },
  middleware: [taskMiddleware]
})

function App() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  )
}

function Map() {
  const dispatch = useDispatch();
  const { data } = useSwr("weather", async () => {
    const response = await fetch(
      "arcgisdata.json"
    );
    const data = await response.json();
    return data;
  });

  React.useEffect(() => {
    if (data) {
      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: "WEATHER",
              id: "weather"
            },
            data: processGeojson(data)
          },
          option: {
            centerMap: true,
            readOnly: false
          },
          config: {}
        })
      );
    }
  }, [dispatch, data]);

  return (
    <KeplerGl
      id="weather"
      mapboxApiAccessToken={"pk.eyJ1IjoidGp1c3Rzb3VwIiwiYSI6ImNreW1uMGQ1YzAzcmEyb3BubjUyeHR1MHMifQ.4HR1kQKCJYfvE6nnGFNiVQ"}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

export default App;
