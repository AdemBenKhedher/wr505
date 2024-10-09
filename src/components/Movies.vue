<template>
    <div class="movie-page">
        <h1>{{ movie.title }}</h1>
        <p>{{ movie.description }}</p>
        <ul>
            <li v-for="genre in movie.genres" :key="genre">{{ genre }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Movies',
    data() {
        return {
            movie: {
                title: 'Inception',
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                genres: ['Action', 'Sci-Fi', 'Thriller']
            }
        };
    }
};
</script>

<style scoped>
.movie-page {
    padding: 20px;
}

.movie-page h1 {
    font-size: 2em;
    margin-bottom: 10px;
}

.movie-page p {
    font-size: 1.2em;
    margin-bottom: 20px;
}

.movie-page ul {
    list-style-type: none;
    padding: 0;
}

.movie-page li {
    background: #f0f0f0;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
}
</style>