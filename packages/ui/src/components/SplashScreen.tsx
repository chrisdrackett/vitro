import { Stack, Box, Spinner } from '@chakra-ui/react'
import React from 'react'
import { Faded } from 'baby-i-am-faded'
import { Logo } from './ExperimentsNav'

export const SplashScreen = ({}) => {
    return (
        <Faded delay={10} cascade duration={600}>
            <Stack
                spacing='40px'
                minW='100vw'
                minH='100vh'
                align='center'
                justify='center'
            >
                <Logo fontSize='60px' />
                <Spinner boxSize={'60px'} borderWidth='10px' />
            </Stack>
        </Faded>
    )
}
