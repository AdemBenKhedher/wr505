<template>
  <div class="login-container">
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Nom d'utilisateur</label>
        <input type="text" id="username" v-model="username" required autofocus>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Se connecter</button>
    </form>
    <div class="forgot-password">
      <a href="#" @click.prevent="forgotPassword">Mot de passe oublié ?</a>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      error: null,
    }
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://symfony.mmi-troyes.fr:8319/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Erreur de connexion'); 
        }

        const data = await response.json();
        console.log('Connexion réussie, token JWT:', data.token);

        
        localStorage.setItem('token', data.token);

        
        this.$router.push('/movies');

      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        this.error = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
      }
    },
    forgotPassword() {
      console.log('Redirection vers la page de mot de passe oublié');
      this.$router.push('/forgot-password');
    }
  }
}
</script>

  
  <style scoped>
  :root {
    --primary-color: #e50914;
    --background-color: #141414;
    --card-background: #181818;
    --text-color: #ffffff;
    --input-background: #333;
    --input-text-color: #ffffff;
  }
  
  .login-container {
    font-family: 'Roboto', sans-serif;
    background-color: var(--card-background);
    color: var(--text-color);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    margin: 2rem auto;
  }
  
  h1 {
    text-align: center;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: none;
    background-color: var(--input-background);
    color: var(--input-text-color);
    border-radius: 4px;
  }
  
  button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #f40612;
  }
  
  .forgot-password {
    text-align: center;
    margin-top: 1rem;
  }
  
  .forgot-password a {
    color: var(--text-color);
    text-decoration: none;
    font-size: 0.9rem;
  }
  
  .forgot-password a:hover {
    text-decoration: underline;
  }
  </style>