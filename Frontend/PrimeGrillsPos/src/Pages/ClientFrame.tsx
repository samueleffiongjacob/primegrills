import ClientMenus from '@components/ClientMenus';
import ClientOrderTemplate from '@components/ClientOrderTemplate';

const Message : string = 'Thank You!';

function ClientFrame() {
  return (
        <div className=' w-full flex min-h-screen overflow-y-auto'>
            <div className='flex flex-col h-screen justify-center m-auto space-y-10 items-center p-4'>
            {Message.split('').map((char, index) => (
                <div key={index} className=' h-7 w-7 bg-primary gap-6 rounded-full animate-ping items-center p-1 flex justify-center'>
                    <p className='font-bold text-3xl'>{char}</p>
                </div>
            ))}
            </div>
            <div className='bg-secondary w-full rounded-l-3xl overflow-y-auto hide-scrollbar'>
                <ClientMenus />
            </div>
            <div className='ml-auto right-0'>
                <ClientOrderTemplate />
            </div>
        </div>
  );
};

export default ClientFrame;