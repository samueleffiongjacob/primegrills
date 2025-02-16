import FoodItems from '@components/FoodItems';

function HomePage() {
  return (
    <div className='bg-secondary w-full rounded-l-3xl overflow-y-auto hide-scrollbar'>
        <FoodItems />
    </div>
  )
}

export default HomePage;