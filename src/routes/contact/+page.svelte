<script>
    let name = $state('');
    let email = $state('');
    let message = $state('');
  
    function handleSubmit() {
      // In a real application, you'd handle form submission here
      console.log('Form submitted:', { name, email, message });
      alert('Thanks for your message! I\'ll get back to you soon.');
      name = '';
      email = '';
      message = '';
    }
</script>

<h1 class="text-3xl font-bold mb-6">Contact Me</h1>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label for="name" class="block mb-1">Name:</label>
    <input
      id="name"
      type="text"
      bind:value={name}
      required
      class="w-full p-2 bg-gray-800 border border-gray-700 rounded"
    />
  </div>
  <div>
    <label for="email" class="block mb-1">Email:</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      required
      class="w-full p-2 bg-gray-800 border border-gray-700 rounded"
    />
  </div>
  <div>
    <label for="message" class="block mb-1">Message:</label>
    <textarea
      id="message"
      bind:value={message}
      required
      class="w-full p-2 bg-gray-800 border border-gray-700 rounded h-32"
    ></textarea>
  </div>
  <button
    type="submit"
    class="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
    >Send Message</button
  >
</form>
