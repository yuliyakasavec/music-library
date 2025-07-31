import { Playlists } from '@/features/playlists';

export function PlaylistsPage() {
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
  // useEffect(() => {
  // setInterval(() => {
  //   setIsVisible((prev) => !prev);
  // }, 10000);
  // }, []);
  return (
    <div>
      <h2>Hello</h2>
      <Playlists />
    </div>
  );
}
