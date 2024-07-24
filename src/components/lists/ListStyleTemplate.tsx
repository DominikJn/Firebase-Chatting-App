import React from 'react'

interface ListStyleTemplateProps {
  children: React.ReactNode
}

const ListStyleTemplate: React.FC<ListStyleTemplateProps> = ({ children }) => {
  return (
    <div className="w-[15%] rounded-lg text-white">
      {children}
    </div>
  )
}

export default ListStyleTemplate