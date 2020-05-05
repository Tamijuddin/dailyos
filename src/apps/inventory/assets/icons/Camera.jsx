import React from 'react'

export default function Camera({ size = 16, color = '#fff' }) {
   return (
      <svg
         width={size}
         height={size}
         viewBox='0 0 32 28'
         fill='none'
         xmlns='http://www.w3.org/2000/svg'
      >
         <path
            d='M15.5561 20.5333C18.3053 20.5333 20.5339 18.3047 20.5339 15.5555C20.5339 12.8064 18.3053 10.5778 15.5561 10.5778C12.807 10.5778 10.5784 12.8064 10.5784 15.5555C10.5784 18.3047 12.807 20.5333 15.5561 20.5333Z'
            fill={color}
         />
         <path
            d='M10.8889 0L8.04222 3.11111H3.11111C1.4 3.11111 0 4.51111 0 6.22222V24.8889C0 26.6 1.4 28 3.11111 28H28C29.7111 28 31.1111 26.6 31.1111 24.8889V6.22222C31.1111 4.51111 29.7111 3.11111 28 3.11111H23.0689L20.2222 0H10.8889ZM15.5556 23.3333C11.2622 23.3333 7.77778 19.8489 7.77778 15.5556C7.77778 11.2622 11.2622 7.77778 15.5556 7.77778C19.8489 7.77778 23.3333 11.2622 23.3333 15.5556C23.3333 19.8489 19.8489 23.3333 15.5556 23.3333Z'
            fill={color}
         />
      </svg>
   )
}