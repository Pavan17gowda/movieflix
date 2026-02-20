import { NextApiRequest, NextApiResponse } from 'next';
import axios from '../../utils/axios';
import { Media, MediaType } from '../../types';
import { parse } from '../../utils/apiResolvers';

interface Response {
  type: 'Success' | 'Error';
  data: Media[] | Error;
}

const apiKey = process.env.TMDB_KEY;

const mockMovies = [
  { id: 41, title: 'Spider-Man: No Way Home', name: 'Spider-Man: No Way Home', backdrop_path: '/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg', poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', overview: 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a superhero.', genre_ids: [28, 12, 878], vote_average: 8.4 },
  { id: 42, title: 'Dune', name: 'Dune', backdrop_path: '/s1FhAJKl6UmVZJ9YNdHp0VGmhkJ.jpg', poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', overview: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding.', genre_ids: [878, 12], vote_average: 8.0 },
  { id: 43, title: 'Encanto', name: 'Encanto', backdrop_path: '/5i3ghCXVLNhewrBjTesMgy4FHT6.jpg', poster_path: '/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg', overview: 'The tale of an extraordinary family, the Madrigals, who live hidden in the mountains of Colombia.', genre_ids: [16, 35, 10751], vote_average: 7.6 },
  { id: 44, title: 'The Batman', name: 'The Batman', backdrop_path: '/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg', overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family.', genre_ids: [80, 9648, 53], vote_average: 7.9 },
  { id: 45, title: 'Top Gun: Maverick', name: 'Top Gun: Maverick', backdrop_path: '/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg', poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', overview: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.', genre_ids: [28, 18], vote_average: 8.3 },
  { id: 46, title: 'Black Panther', name: 'Black Panther', backdrop_path: '/6ELJEzQJ3Y45HczvreC3dg0GV5R.jpg', poster_path: '/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', overview: 'T Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people.', genre_ids: [28, 12, 878], vote_average: 7.3 },
  { id: 47, title: 'Joker', name: 'Joker', backdrop_path: '/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg', poster_path: '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', overview: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society.', genre_ids: [80, 53, 18], vote_average: 8.2 },
  { id: 48, title: 'Shang-Chi', name: 'Shang-Chi', backdrop_path: '/cinER0ESG0eJ49kXlExM0MEWGxW.jpg', poster_path: '/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg', overview: 'Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the Ten Rings.', genre_ids: [28, 12, 14], vote_average: 7.6 },
  { id: 49, title: 'Eternals', name: 'Eternals', backdrop_path: '/c6H7Z4u73ir3cIoCteuhJh7UCAR.jpg', poster_path: '/6AdXwFTRTAzggD2QUTt5B7JFGKL.jpg', overview: 'The Eternals, an immortal alien race, emerge from hiding after thousands of years to protect Earth.', genre_ids: [28, 12, 14], vote_average: 6.9 },
  { id: 50, title: 'No Time to Die', name: 'No Time to Die', backdrop_path: '/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg', poster_path: '/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg', overview: 'James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA.', genre_ids: [28, 12, 53], vote_average: 7.4 },
  { id: 51, title: 'Free Guy', name: 'Free Guy', backdrop_path: '/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg', poster_path: '/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg', overview: 'A bank teller discovers that he is actually an NPC inside a brutal, open world video game.', genre_ids: [35, 28, 878], vote_average: 7.7 },
  { id: 52, title: 'Venom: Let There Be Carnage', name: 'Venom: Let There Be Carnage', backdrop_path: '/70nxSw3mFBsGmtkvcs91PbjerwD.jpg', poster_path: '/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg', overview: 'Eddie Brock attempts to reignite his career by interviewing serial killer Cletus Kasady.', genre_ids: [878, 28, 12], vote_average: 7.1 },
  { id: 53, title: 'Black Widow', name: 'Black Widow', backdrop_path: '/keIxh0wPr2Ymj0Btjh4gW7JJ89e.jpg', poster_path: '/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg', overview: 'Natasha Romanoff confronts the darker parts of her ledger when a dangerous conspiracy ties to her past.', genre_ids: [28, 12, 878], vote_average: 7.3 },
  { id: 54, title: 'Cruella', name: 'Cruella', backdrop_path: '/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg', poster_path: '/rTh4K5uw9HypmpGslcKd4QfHl93.jpg', overview: 'A live-action prequel feature film following a young Cruella de Vil.', genre_ids: [35, 80], vote_average: 8.0 },
  { id: 55, title: 'The Suicide Squad', name: 'The Suicide Squad', backdrop_path: '/jlGmlFOcfo8n5tURmhC7YVd4Iyy.jpg', poster_path: '/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg', overview: 'Supervillains Harley Quinn, Bloodsport, Peacemaker and a collection of cons at Belle Reve prison join Task Force X.', genre_ids: [28, 35, 12], vote_average: 7.6 },
  { id: 56, title: 'Jungle Cruise', name: 'Jungle Cruise', backdrop_path: '/7WJjFviFBffEJvkAms4uWwbcVUk.jpg', poster_path: '/9dKCd55IuTT5QRs989m9Qlb7d2B.jpg', overview: 'Dr. Lily Houghton enlists the aid of wisecracking skipper Frank Wolff to take her down the Amazon.', genre_ids: [12, 14, 35], vote_average: 7.7 },
  { id: 57, title: 'Ghostbusters: Afterlife', name: 'Ghostbusters: Afterlife', backdrop_path: '/pcDc2WJAYGJTTvRSEIpRZwM3Ola.jpg', poster_path: '/sg4xJaufDiQl7caFEskBtQXfD4x.jpg', overview: 'When a single mom and her two kids arrive in a small town, they begin to discover their connection to Ghostbusters.', genre_ids: [14, 35, 12], vote_average: 7.2 },
  { id: 58, title: 'The Matrix Resurrections', name: 'The Matrix Resurrections', backdrop_path: '/eNI7PtK6DEYgZmHWP9gQNuff8pv.jpg', poster_path: '/8c4a8kE7PizaGQQnditMmI1xbRp.jpg', overview: 'Return to a world of two realities: one, everyday life; the other, what lies behind it.', genre_ids: [878, 28, 12], vote_average: 6.7 },
  { id: 59, title: 'Sing 2', name: 'Sing 2', backdrop_path: '/cP7odDzzFBD54H0xvRdJCwjVLZc.jpg', poster_path: '/aWeKITRFbbwY8txG5uCj4rMCfSP.jpg', overview: 'Buster Moon and his friends must persuade reclusive rock star Clay Calloway to join them.', genre_ids: [16, 35, 10751], vote_average: 7.9 },
  { id: 60, title: 'Resident Evil', name: 'Resident Evil', backdrop_path: '/7uRbWOXxpWDMtnsd2PF3clu65jc.jpg', poster_path: '/wIwXKB7uwOlZJJVGY7OMmZ7dL0Z.jpg', overview: 'Welcome to Raccoon City, once the booming home of pharmaceutical giant Umbrella Corporation.', genre_ids: [27, 28, 878], vote_average: 5.9 }
];

export default async function handler(request: NextApiRequest, response: NextApiResponse<Response>) {
  const { type, time } = request.query;

  // Return mock data instead of calling API
  const data = parse(mockMovies, type as MediaType);
  response.status(200).json({ type: 'Success', data });
}
