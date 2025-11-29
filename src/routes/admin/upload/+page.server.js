import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"

export async function load({ locals }) {
	const user = locals.user
    if(!user){throw redirect(307, '/login')}

    const settings = await setup()

    return {user, settings}
}