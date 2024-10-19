<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
        <h3>Add Actor</h3>
        <form @submit.prevent="submitForm">
          <label for="lastname">Last Name:</label>
          <input v-model="actor.lastname" type="text" id="lastname" required />
          
          <label for="firstname">First Name:</label>
          <input v-model="actor.firstname" type="text" id="firstname" required />
          
          <label for="dob">Date of Birth:</label>
          <input v-model="actor.dob" type="date" id="dob" required />
          
          <label for="nationalty">Nationality:</label>
          <input v-model="actor.nationalty" type="text" id="nationalty" required />
          
          <label for="awards">Awards:</label>
          <input v-model="actor.awards" type="number" id="awards" required />
          
          <label for="gender">Gender:</label>
          <select v-model="actor.gender" id="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          
          <div class="modal-buttons">
            <button type="button" @click="$emit('close')" class="cancel">Cancel</button>
            <button type="submit" class="save">Add Actor</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        actor: {
          lastname: '',
          firstname: '',
          dob: '',
          nationalty: '',
          awards: 0,
          gender: 'male'
        }
      };
    },
    methods: {
      submitForm() {
        this.$emit('addActor', this.actor); // Send data to parent component
        this.$emit('close'); // Close the modal after submission
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal h3 {
    margin-top: 0;
    margin-bottom: 20px;
  }
  
  .modal form {
    display: flex;
    flex-direction: column;
  }
  
  .modal label {
    margin-top: 10px;
    font-weight: bold;
  }
  
  .modal input,
  .modal select {
    margin-top: 5px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .modal-buttons button {
    margin-left: 10px;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }
  
  .modal-buttons button.save {
    background-color: #4CAF50;
    color: white;
  }
  
  .modal-buttons button.save:hover {
    background-color: #45a049;
  }
  
  .modal-buttons button.cancel {
    background-color: #f44336;
    color: white;
  }
  
  .modal-buttons button.cancel:hover {
    background-color: #d32f2f;
  }
  </style>