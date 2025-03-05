import { ReactNode } from "react"

type Props = {
    children: ReactNode
    maxWidth: string
    onClick?: () => void
}

export default function ModalWrapper({children, maxWidth, onClick}:Props) {
    return (
      <div
      onClick={onClick} 
      className="bg-gray-900/50 backdrop-blur-2xl overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[999] flex flex-col justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full">
          <div className={`relative p-4 w-full ${maxWidth ? maxWidth : 'max-w-2xl'} max-h-full`}>
              {/* <!-- Modal content --> */}
              {children}
          </div>
      </div>
    )
  }
  