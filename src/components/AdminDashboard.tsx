import { jsx } from 'hono/jsx'
import { User } from '../db/schema'

export const AdminDashboard = ({ users }: { users: User[] }) => {
    return (
        <html>
            <head>
                <title>Admin Dashboard</title>
                <script src="https://unpkg.com/htmx.org@1.9.12"></script>
                <script src="https://unpkg.com/alpinejs@3.14.0" defer></script>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
            </head>
            <body class="bg-gray-900 text-white p-8">
                <div class="max-w-6xl mx-auto">
                    <h1 class="text-3xl font-bold mb-4">Admin Dashboard</h1>
                    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 class="text-xl font-semibold mb-4">Users</h2>
                        <div hx-get="/admin/users" hx-trigger="every 60s" hx-swap="outerHTML">
                            <table class="min-w-full divide-y divide-gray-700">
                                <thead class="bg-gray-700">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">UUID</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-gray-800 divide-y divide-gray-700">
                                    {users.map(user => (
                                        <tr key={user.uuid}>
                                            <td class="px-6 py-4 whitespace-nowrap">{user.uuid}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">{user.notes}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <button class="text-blue-400 hover:text-blue-600">Edit</button>
                                                <button hx-delete={`/admin/users/${user.uuid}`} hx-confirm="Are you sure?" class="text-red-400 hover:text-red-600 ml-4">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
