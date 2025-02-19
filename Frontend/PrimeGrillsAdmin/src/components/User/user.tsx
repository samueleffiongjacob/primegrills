const User = () => {
    
  interface staffusers {
    id: number;
    name: string;
    roles: string;
    status: string;
  }

  const users = [
    { id: 1, name: "Chicken Pepperoni", roles: " Waiter", status: "Active" },
    { id: 2, name: "Grilled Chicken",roles: " Waiter", status: "Active"  },
    { id: 3, name: "Grilled Chicken",roles: " Cook", status: "Active"  },
    { id: 4, name: "Grilled Chicken",roles: " HR" , status: "Inactive" },
    { id: 5, name: "Grilled Chicken", roles: " HR Assistant", status: "Active"  },
    { id: 6, name: "Grilled Chicken", roles: " Cashier", status: "Active"  },
    { id: 7, name: "Grilled Chicken", roles: " Cashier", status: "Active"  },
    { id: 8, name: "Grilled Chicken",roles: " System Admin", status: "Inactive"  },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="py-5 bg-white border-b flex users-center justify-between px-6">
          <h1 className="text-xl font-semibold">User</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap gap-4">
          
            {/* Search and Pagination */}
            <div className="flex gap-4 ml-auto">
              <input
                type="number"
                placeholder="100"
                className="w-24 p-2  pl-3 border rounded-lg border-[#EE7F61] bg-gray-300 text-black"
                defaultValue="100"
              />
              <input
                type="search"
                placeholder="Search"
                className="w-64 p-2 pl-3  border rounded-lg border-[#EE7F61] bg-gray-300 text-black"
              />
            </div>
          </div>

          {/* staff Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-[#EE7F61] text-white p-4">
                  <th className="py-2 px-4 text-left">S/N</th>
                  <th className="py-2 px-4 text-left">User Name</th>
                  <th className="py-2 px-4 text-left">Roles</th>
                  <th className="py-2 px-4 text-left">Status</th>
             
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`shadow-lg rounded-2xl ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-2 px-4">{user.id}.</td>
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.roles}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default User;
