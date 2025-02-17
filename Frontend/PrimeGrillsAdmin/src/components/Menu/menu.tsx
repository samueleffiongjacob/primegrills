
import plus from "../../assets/images/plusSign.png";
import pencil from "../../assets/images/pencil.png";
import trash from "../../assets/images/trash.png";


const MenuDashboard = () => {
    const AddButton = () => {
        return (
        //   <button
        //     onClick={onClick}
        //     className="flex items-center bg-[#d84315] text-white px-4 py-2 rounded hover:bg-[#bf360c] shadow-md hover:shadow-lg transition-all duration-300"
        //   >
            <img src={plus} alt="Add Icon" className="h-10 w-10 mr-2" />
          
        );
      };
      interface menuItems {
        id: number;
        name: string;
      }
  const menuItems = [
    { id: 1, name: "Chicken Pepperoni" },
    { id: 2, name: "Grilled Chicken" },
    { id: 3, name: "Grilled Chicken" },
    { id: 4, name: "Grilled Chicken" },
    { id: 5, name: "Grilled Chicken" },
    { id: 6, name: "Grilled Chicken" },
    { id: 7, name: "Grilled Chicken" },
    { id: 8, name: "Grilled Chicken" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[88px] bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Menu</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Add Button */}
            <AddButton />
            {/* Search and Pagination */}
            <div className="flex gap-4 ml-auto">
              <input
                type="number"
                placeholder="100"
                className="w-24 p-2 border rounded-lg border-[#EE7F61] bg-gray-400"
                defaultValue="100"
              />
              <input
                type="search"
                placeholder="Search"
                className="w-64 p-2 border rounded-lg border-[#EE7F61] bg-gray-400 text-white"
              />
            </div>
          </div>

          {/* Menu Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-[#EE7F61] text-white p-4">
                  <th className="py-2 px-4 text-left">S/N</th>
                  <th className="py-2 px-4 text-left">Menu Name</th>
                  <th className="py-2 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`shadow-lg rounded-2xl ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-2 px-4">{item.id}.</td>
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit Button */}
                        <button className="p-2  hover:text-[#bf360c] hover:bg-orange-50 rounded">
                            <img src={pencil} alt="pencil-icon" className="h-5 w-5"/>
                        </button>
                        {/* Delete Button */}
                        <button className="p-2  hover:text-[#bf360c] hover:bg-orange-50 rounded">
                            <img src={trash} alt="pencil-icon" className="h-5 w-5"/>
                        </button>
                      </div>
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

export default MenuDashboard;
