document.addEventListener('DOMContentLoaded', () =>
{
    const form = document.getElementById('loginForm');
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

	const successMessage = localStorage.getItem('successMessage');
	if (successMessage)
	{
		showMessage(successMessage, 'success');
		localStorage.removeItem('successMessage');

		setTimeout(() =>
		{
			messageContainer.innerHTML = '';
		}, 2000);
	}

    form.addEventListener('submit', async (event) =>
	{
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try
		{
            const response = await fetch('https://localhost:8000/api/user/login/',
			{
                method: 'POST',
                headers:
				{
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(data),
            });

            if (!response.ok)
			{
                const errorText = await response.text();
                throw new Error(`Erreur HTTP: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            
            const accessToken = result.access;
            const refreshToken = result.refresh;

            if (accessToken && refreshToken)
			{
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                showMessage('Connexion réussie !', 'success');
				setTimeout(() =>
				{
					window.location.href = '../index.html';
				}, 1500);
            }
			else
			{
                alert('Échec de la connexion : aucun token reçu.');
            }
        }
		catch (error)
		{
            console.error('Erreur:', error);
            alert('Une erreur s\'est produite. Vérifiez la console pour plus de détails.');
        }
    });
});
