import { NextApiResponse, NextApiRequest } from 'next';

import { parse } from '../../utils/apiResolvers';
import { MediaType, Media } from '../../types';
import getInstance from '../../utils/axios';

interface Response {
  type: 'Success' | 'Error';
  data: Media[] | Error;
}

const apiKey = process.env.TMDB_KEY;

const mockMovies = [
  { id: 21, title: 'The Conjuring', name: 'The Conjuring', backdrop_path: '/sFMsXlH1FvBPRdzvDSGxNJzHHwZ.jpg', poster_path: '/wVYREutTvI2tmxr6ujrHT704wGF.jpg', overview: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence.', genre_ids: [27, 9648, 53], vote_average: 7.5 },
  { id: 22, title: 'A Quiet Place', name: 'A Quiet Place', backdrop_path: '/roYyPiQDQKmIKUEhO912693tSja.jpg', poster_path: '/nAU74GmpUk7t5iklEp3bufwDq4n.jpg', overview: 'In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.', genre_ids: [27, 18, 878], vote_average: 7.5 },
  { id: 23, title: 'Get Out', name: 'Get Out', backdrop_path: '/qFxBAVDLqYKFdAXHbcPy6XqLPfE.jpg', poster_path: '/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg', overview: 'A young African-American visits his white girlfriend parents for the weekend, where his simmering uneasiness about their reception.', genre_ids: [27, 53, 9648], vote_average: 7.7 },
  { id: 24, title: 'Hereditary', name: 'Hereditary', backdrop_path: '/w4yJNd7RyKrYIvHJRiz0F1nePVn.jpg', poster_path: '/p9fmuz2Oj3HtUhEqgOyNGmxtbB6.jpg', overview: 'A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.', genre_ids: [27, 18, 9648], vote_average: 7.3 },
  { id: 25, title: 'It', name: 'It', backdrop_path: '/tcheoA2nPATCm2vvXw2hVQoaEFD.jpg', poster_path: '/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg', overview: 'In the summer of 1989, a group of bullied kids band together to destroy a shape-shifting monster.', genre_ids: [27, 53], vote_average: 7.3 },
  { id: 26, title: 'The Exorcist', name: 'The Exorcist', backdrop_path: '/6tu0j9cDm8zTmEVpEtJLJrl9mWW.jpg', poster_path: '/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg', overview: 'When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.', genre_ids: [27], vote_average: 8.0 },
  { id: 27, title: 'The Shining', name: 'The Shining', backdrop_path: '/3GJrSD8MXs3ufQ3F7wIJGP0524C.jpg', poster_path: '/xazWoLealQwEgqZ89MLZklLZD3k.jpg', overview: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.', genre_ids: [27, 53], vote_average: 8.4 },
  { id: 28, title: 'Sinister', name: 'Sinister', backdrop_path: '/3s8DSYcOHbfQsZGHrz0kh0mCPKR.jpg', poster_path: '/6r0EYLuYEwVQPFvdDJP3LGVKq1Y.jpg', overview: 'Washed-up true crime writer finds a box of super 8 home movies in his new home that suggest the murder he is researching.', genre_ids: [27, 53], vote_average: 6.8 },
  { id: 29, title: 'Insidious', name: 'Insidious', backdrop_path: '/70aLyPSU3EBjHUnJGvYSgCXL7i2.jpg', poster_path: '/dKbpfFhqKQRHWZmdDHQMdWWZHto.jpg', overview: 'A family looks to prevent evil spirits from trapping their comatose child in a realm called The Further.', genre_ids: [27, 53], vote_average: 6.9 },
  { id: 30, title: 'The Ring', name: 'The Ring', backdrop_path: '/gzoWRTWIvHf5qPaqLOLxHb4BQ5H.jpg', poster_path: '/gzoWRTWIvHf5qPaqLOLxHb4BQ5H.jpg', overview: 'A journalist must investigate a mysterious videotape which seems to cause the death of anyone one week after viewing it.', genre_ids: [27, 9648], vote_average: 7.1 },
  { id: 31, title: 'Halloween', name: 'Halloween', backdrop_path: '/bXa874jCkwrnDZp4fg3OHCIgL3r.jpg', poster_path: '/wijlZ3HaYMvlDTPqJoTCWKFkCPU.jpg', overview: 'Fifteen years after murdering his sister on Halloween night, Michael Myers escapes and returns to kill again.', genre_ids: [27, 53], vote_average: 7.7 },
  { id: 32, title: 'The Witch', name: 'The Witch', backdrop_path: '/4zTBoQVqJWxLEZFBUx3mKQN7RJL.jpg', poster_path: '/zap5hpFCWSvdWSuPGAQyjUv2wAC.jpg', overview: 'A family in 1630s New England is torn apart by the forces of witchcraft, black magic and possession.', genre_ids: [27, 9648, 14], vote_average: 7.0 },
  { id: 33, title: 'Midsommar', name: 'Midsommar', backdrop_path: '/lXB5VQZD8G0qYvVZdFqkGJNkLwG.jpg', poster_path: '/7LEI8ulZzO5gy9Ww2NVCrKmHeDZ.jpg', overview: 'A couple travels to Sweden to visit a rural hometown fabled midsummer festival, but what begins as a pastoral paradise.', genre_ids: [27, 18, 9648], vote_average: 7.1 },
  { id: 34, title: 'Us', name: 'Us', backdrop_path: '/jQwXoQ8FZzm0YdDjLpvSGPHZJ0z.jpg', poster_path: '/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg', overview: 'A family vacation turns into a nightmare when they are confronted by their doppelgangers.', genre_ids: [27, 53, 9648], vote_average: 6.8 },
  { id: 35, title: 'The Babadook', name: 'The Babadook', backdrop_path: '/kFvyIsVYBqMwXNDqJZZPJqvZBqT.jpg', poster_path: '/lXB5VQZD8G0qYvVZdFqkGJNkLwG.jpg', overview: 'A single mother and her child fall into a deep well of paranoia when an eerie children book titled Monstrous.', genre_ids: [27, 18], vote_average: 6.8 },
  { id: 36, title: 'Scream', name: 'Scream', backdrop_path: '/7MW2h4nUPvkrJGOYJa5wvKLvRNJ.jpg', poster_path: '/3O3klyyYpAZBBE4n7IngzTomRDp.jpg', overview: 'A year after the murder of her mother, a teenage girl is terrorized by a new killer.', genre_ids: [27, 9648], vote_average: 7.4 },
  { id: 37, title: 'The Descent', name: 'The Descent', backdrop_path: '/4jZpwmFiR8qLVzLZPHF3p8K3WJL.jpg', poster_path: '/nWHdcFWGALtYZf3r0W0aKuJfLqR.jpg', overview: 'A caving expedition goes horribly wrong, as the explorers become trapped and pursued by strange creatures.', genre_ids: [27, 12], vote_average: 7.2 },
  { id: 38, title: 'Saw', name: 'Saw', backdrop_path: '/8JNkVUWs5kpCue5JXjKEyr4EvvO.jpg', poster_path: '/qKJPV6gkL4vJJFjYLbPZJYxqLKL.jpg', overview: 'Two strangers awaken in a room with no recollection of how they got there, and soon discover they are pawns.', genre_ids: [27, 9648], vote_average: 7.6 },
  { id: 39, title: 'The Texas Chain Saw Massacre', name: 'The Texas Chain Saw Massacre', backdrop_path: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', poster_path: '/w108VHhZ4ZFShW3FUHJqCw8SBHK.jpg', overview: 'Five friends visiting their grandfather house in Texas fall victim to a family of cannibals.', genre_ids: [27], vote_average: 7.5 },
  { id: 40, title: 'Nightmare on Elm Street', name: 'Nightmare on Elm Street', backdrop_path: '/3xdl1vqKFAJxXhBqTWiLYZonqmL.jpg', poster_path: '/3xdl1vqKFAJxXhBqTWiLYZonqmL.jpg', overview: 'Several people are hunted by a cruel serial killer who kills his victims in their dreams.', genre_ids: [27], vote_average: 7.5 }
];

export default async function handler(request: NextApiRequest, response: NextApiResponse<Response>) {
  const { type, genre } = request.query;

  // Return mock data instead of calling API
  const data = parse(mockMovies, type as MediaType);
  response.status(200).json({ type: 'Success', data });
}
