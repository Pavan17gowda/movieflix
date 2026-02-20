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
  { id: 1, title: 'Avatar: The Way of Water', name: 'Avatar: The Way of Water', backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg', poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', overview: 'Set more than a decade after the events of the first film, learn the story of the Sully family.', genre_ids: [878, 12, 28], vote_average: 7.6 },
  { id: 2, title: 'Black Panther: Wakanda Forever', name: 'Black Panther: Wakanda Forever', backdrop_path: '/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg', poster_path: '/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', overview: 'Queen Ramonda, Shuri, M Baku, Okoye and the Dora Milaje fight to protect their nation.', genre_ids: [28, 12, 18], vote_average: 7.3 },
  { id: 3, title: 'Top Gun: Maverick', name: 'Top Gun: Maverick', backdrop_path: '/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg', poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', overview: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.', genre_ids: [28, 18], vote_average: 8.3 },
  { id: 4, title: 'Spider-Man: No Way Home', name: 'Spider-Man: No Way Home', backdrop_path: '/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg', poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', overview: 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes.', genre_ids: [28, 12, 878], vote_average: 8.4 },
  { id: 5, title: 'The Batman', name: 'The Batman', backdrop_path: '/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg', overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City.', genre_ids: [80, 9648, 53], vote_average: 7.9 },
  { id: 6, title: 'Doctor Strange in the Multiverse of Madness', name: 'Doctor Strange in the Multiverse of Madness', backdrop_path: '/wcKFYIiVDvRURrzglV9kGu7fpfY.jpg', poster_path: '/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', overview: 'Doctor Strange teams up with a mysterious young woman to travel across the multiverse.', genre_ids: [14, 28, 12], vote_average: 7.4 },
  { id: 7, title: 'Minions: The Rise of Gru', name: 'Minions: The Rise of Gru', backdrop_path: '/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg', poster_path: '/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg', overview: 'A fanboy of a supervillain supergroup known as the Vicious 6, Gru hatches a plan to become evil.', genre_ids: [16, 35, 10751], vote_average: 7.8 },
  { id: 8, title: 'Thor: Love and Thunder', name: 'Thor: Love and Thunder', backdrop_path: '/p1F51Lvj3sMopG948F5HsBbl43C.jpg', poster_path: '/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', overview: 'After his retirement is interrupted by Gorr the God Butcher, Thor enlists the help of King Valkyrie.', genre_ids: [28, 35, 14], vote_average: 6.8 },
  { id: 9, title: 'Jurassic World Dominion', name: 'Jurassic World Dominion', backdrop_path: '/53z2fXEKfnNg2uSOPss2unPBGX1.jpg', poster_path: '/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg', overview: 'Four years after Isla Nublar was destroyed, dinosaurs now live alongside humans all over the world.', genre_ids: [28, 12, 878], vote_average: 7.0 },
  { id: 10, title: 'Lightyear', name: 'Lightyear', backdrop_path: '/kjQBrc00fB2RjHZB3PGR4w9ibpz.jpg', poster_path: '/ox4goZd956BxqJH6iLwhWPL9ct4.jpg', overview: 'Legendary Space Ranger Buzz Lightyear embarks on an intergalactic adventure.', genre_ids: [16, 878, 10751], vote_average: 7.1 },
  { id: 11, title: 'Encanto', name: 'Encanto', backdrop_path: '/3G1Q5xF40HkUBJXxt2DQgQzKTp5.jpg', poster_path: '/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg', overview: 'The tale of an extraordinary family, the Madrigals, who live hidden in the mountains of Colombia.', genre_ids: [16, 35, 10751], vote_average: 7.6 },
  { id: 13, title: 'The Northman', name: 'The Northman', backdrop_path: '/wu1uilmhM4TdluKi2ytfz8gidHf.jpg', poster_path: '/zhLKlUaF1SEpO58ppHIAyENkwgw.jpg', overview: 'From visionary director Robert Eggers comes The Northman, an action-filled epic.', genre_ids: [28, 12, 18], vote_average: 7.2 },
  { id: 14, title: 'Sonic the Hedgehog 2', name: 'Sonic the Hedgehog 2', backdrop_path: '/egoyMDLqCxzjnSrWOz50uLlJWmD.jpg', poster_path: '/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg', overview: 'After settling in Green Hills, Sonic is eager to prove he has what it takes to be a true hero.', genre_ids: [28, 35, 10751], vote_average: 7.5 },
  { id: 15, title: 'Fantastic Beasts: The Secrets of Dumbledore', name: 'Fantastic Beasts: The Secrets of Dumbledore', backdrop_path: '/zGLHX92Gk96O1DJvLil7ObJTbaL.jpg', poster_path: '/jrgifaYeUtTnaH7NF5Drkgjg2MB.jpg', overview: 'Professor Albus Dumbledore knows the powerful, dark wizard Gellert Grindelwald is moving.', genre_ids: [14, 12], vote_average: 6.9 },
  { id: 16, title: 'Morbius', name: 'Morbius', backdrop_path: '/5P8SmMzSNYikXpxil6BYzJ16611.jpg', poster_path: '/6JjfSchsU6daXk2AKX8EEBjO3Fm.jpg', overview: 'Dangerously ill with a rare blood disorder, and determined to save others suffering his same fate.', genre_ids: [28, 878, 53], vote_average: 5.2 },
  { id: 19, title: 'The Lost City', name: 'The Lost City', backdrop_path: '/6sJcVzGCwrDCBMV0DU6eRzA2UxM.jpg', poster_path: '/neMZH82Stu91d3iqvLdNQfqPPyl.jpg', overview: 'Reclusive author Loretta Sage writes about exotic places in her popular adventure novels.', genre_ids: [28, 35, 10749], vote_average: 6.8 },
  { id: 20, title: 'Everything Everywhere All at Once', name: 'Everything Everywhere All at Once', backdrop_path: '/yF1eOkaYvwiORauRCPWznV9xVvi.jpg', poster_path: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', overview: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what important to her.', genre_ids: [28, 12, 35], vote_average: 8.1 }
];

export default async function handler(request: NextApiRequest, response: NextApiResponse<Response>) {
  const { type } = request.query;

  // Return mock data instead of calling API
  const data = parse(mockMovies, type as MediaType);
  response.status(200).json({ type: 'Success', data });
}
