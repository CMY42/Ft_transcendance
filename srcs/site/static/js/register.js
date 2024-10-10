document.addEventListener('DOMContentLoaded', () =>
{
    const form = document.getElementById('registrationForm');
	const messageContainer = document.getElementById('messageContainer');

	function showMessage(message, type = 'success')
	{
		messageContainer.innerHTML =
		`
		<div class="alert alert-${type}" role="aler">
			${message}
		</div>
		`;
	}

    form.addEventListener('submit', async (event) =>
	{
        event.preventDefault();

        const formData = new FormData(form);

        try
		{
            console.log('Envoi des données:', formData);

            const response = await fetch('https://localhost:8000/api/user/register/',
			{
                method: 'POST',
                headers: {},
                mode: 'cors',
                body: formData,
            });
            if (!response.ok)
			{
                const errorText = await response.text();
                throw new Error(`Erreur HTTP: ${response.status} ${errorText}`);
            }
            const result = await response.json();
            localStorage.setItem('successMessage', 'Inscription réussie !');
            console.log('Réponse du serveur:', result);
			window.location.href = '../html/login.html';
        }
		catch (error)
		{
            console.error('Erreur:', error);
            alert('Une erreur s\'est produite. Vérifiez la console pour plus de détails.');
        }
    });
});
