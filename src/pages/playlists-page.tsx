import { useQuery } from '@tanstack/react-query';
import { client } from '../shared/api/client';
import { useEffect } from 'react';

function App() {
  // SECOND OPTION
  // useEffect(() => {
  //   client
  //     .GET('/playlists')
  //     .then((response) => response.data)
  //     .then((data) => {
  //       console.log(data);
  //     });
  // }, []);

  // FIRST OPTION
  // fetch('https://musicfun.it-incubator.app/api/1.0/playlists', {
  //   headers: {
  //     'api-key': '01767086-cd0e-4887-8f75-a7fd5a29c850',
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data);
  //     return data;
  //   });

  //const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    // setInterval(() => {
    //   setIsVisible((prev) => !prev);
    // }, 10000);
  }, []);
  return (
    <>
      <h2>Hello Yuliya</h2>
      <Playlists />
    </>
  );
}

export const Playlists = () => {
  const query = useQuery({
    queryKey: ['playlists'],
    queryFn: () => {
      return client.GET('/playlists');
    },
  });

  return (
    <div>
      <ul>
        {query.data?.data?.data.map((playlist) => (
          <li key={playlist.id}>{playlist.attributes.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
