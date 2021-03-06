import { Box, Stack, Image } from '@chakra-ui/react'
import { Faded } from 'baby-i-am-faded'
import {
    Button,
    Divider,
    Feature,
    Footer,
    Heading,
    Hero,
    LandingProvider,
    Link,
    NavBar,
    PageContainer,
    PatternBackground,
    SectionTitle,
    CodeSnippet,
} from 'landing-blocks/src'
import codeTheme from 'prism-react-renderer/themes/vsDark'

import { useEffect, useState } from 'react'
import { GITHUB_LINK, VITRO_DEMO_URL } from '../constants'
import GradientBgImg from '../public/gradient-bg.svg'
import PlayButton from '../public/play-button.svg'

import AnalyzeStep from '../public/analyze_step.svg'
import ShowcaseStep from '../public/showcase_step.svg'
import DocsStep from '../public/document_step.svg'
import ExperimentStep from '../public/experiment_step.svg'

import Logo from '../public/vitro_text_and_beaker.svg'

const heroCode = `
npm i -g @vitro/cli
vitro init
vitro
`

const Page = () => (
    <LandingProvider
        position='relative'
        pageWidth='1100px'
        // minH='100%'
        minH='100%'
        black='#333'
        primary='#4C00EB'
        color='#444'
    >
        <MyNavbar />
        <Box
            opacity={0.7}
            mt='0px !important'
            position='absolute'
            // width='100vw'
            alignSelf='center'
            top='0px'
            zIndex={-1}
            as={GradientBgImg}
        />
        <Hero
            // bullet='Introducing Vitro 1.0'
            heading={
                <Heading>
                    Best way to <br />
                    <HeadingVerbAnimation /> <br />
                    React components
                </Heading>
            }
            subheading={
                <Box lineHeight='1.6em'>
                    Vitro helps you develop React UI components in isolation
                    <br />
                    while staying organized and productive
                </Box>
            }
            cta={
                <a target='_blank' href={VITRO_DEMO_URL}>
                    <Button>See a demo</Button>
                </a>
            }
            // image={<Image h='200px' w='300px' src='/robot.svg' />}
            image={
                <PatternBackground
                    pattern='diagonalLinesSm'
                    color='gray.400'
                    scatter={-20}
                >
                    {/* <Box cursor='pointer' width='160px' as={PlayButton} /> */}
                    <CodeSnippet
                        fontSize='1.1em'
                        minH='0'
                        language='bash'
                        dark
                        px='20'
                        pl='10'
                        code={heroCode.trim()}
                        theme={codeTheme}
                    />
                </PatternBackground>
            }
            // cta={<Button>Try Genql in 5 minutes</Button>}
            // fingerprint='Already using Genql? Sign in'
        />
        <Divider heading='one tool to rule them all' />
        <Features alignSelf='center' />

        <Stack spacing='20' position='relative' align='stretch'>
            <Box
                opacity={0.3}
                mt='0px !important'
                position='absolute'
                width='100%'
                bottom='0px'
                zIndex={-1}
                transform='scaleY(-1) scaleX(-1)'
                as={GradientBgImg}
            />

            <SectionTitle
                // mt='0px !important'
                heading='Most productive way to experiment, showcase your components'
                subheading='Most productive way to experiment, showcase your components'
            />
            {/* <Box h='20px' /> */}

            <Image
                minWidth='0px'
                src='/vitro-site-mockup.jpeg'
                width={['95%', null, null, '800px']}
                borderRadius='md'
                shadow='sm'
                alignSelf='center'
                // opacity={0.9}
            />
        </Stack>

        <Feature
            flip
            heading='Build components seeing changes in real time'
            subheading='Vitro supports fast refresh, changes to code are instantly picked up by the UI.'
            image={
                <Image
                    src='/build-addons.png'
                    borderRadius='md'
                    shadow='xl'
                    height='340px'
                    alignSelf='start'
                />
            }
        />
        <Feature
            heading='Incremental builds for instant start up time'
            subheading={`The start up time is less than 2 seconds, you can start prototyping your react components without waiting all your code base to compile`}
            image={
                <Image
                    src='/share-document.png'
                    borderRadius='md'
                    shadow='xl'
                    alignSelf='flex-end'
                    height='400px'
                />
            }
        />

        {/* <Section degree={0} zIndex={1} bg='white'>
            <Banner
                //
                heading='Want to use the cli instead?'
                bullet='cli is cool too'
                subheading='You can generate the client locally based on an endpoint or a local graphql schema.'
                bg='transparent'
                image={
                    <Image
                        ml='-60px'
                        minW='300px'
                        width='500px'
                        src='/banner.jpg'
                    />
                }
                cta={
                    <a href='/docs'>
                        <Button>Read the Docs</Button>
                    </a>
                }
            />
        </Section> */}
        <MyFooter />
    </LandingProvider>
)

export function MyFooter({ ...rest }) {
    return (
        <Footer
            businessName='Vitro'
            columns={{
                Resources: [
                    <Link href={GITHUB_LINK}>Github</Link>,
                    <Link href={'/docs'}>Docs</Link>,
                ],
                'Find Us': [
                    <Link href='https://twitter.com/__morse'>Twitter</Link>,
                    <Link href='https://github.com/remorses/'>Github</Link>,
                ],
                'Who made this?': [
                    <Link href='https://twitter.com/__morse'>My Twitter</Link>,
                    <Link href='https://github.com/remorses/'>My Github</Link>,
                ],
                // 'Proudly sponsored by Vercel': [
                //     <Box as={PoweredByVercel} alignSelf='center' />,
                // ],
            }}
            {...rest}
        />
    )
}
export function MyNavbar({ ...rest }) {
    const navs = [
        <Link isExternal href={GITHUB_LINK}>
            Github
        </Link>,
        <Link isExternal href={'/docs'}>
            Docs
        </Link>,
    ]
    return (
        <NavBar
            logo={
                <Logo width='140px' />
                // <Image
                //     width='120px'
                //     stroke='#000'
                //     src='/logo_on_black.svg'
                // />
            }
            navs={navs}
            {...rest}
        />
    )
}

const HeadingVerbAnimation = (props) => {
    const texts = ['Build', 'Test', 'Showcase', 'Prototype', 'Experiment']
    const [i, setI] = useState(0)
    useEffect(() => {
        const id = setInterval(() => {
            setI((i) => (i + 1 >= texts.length ? 0 : i + 1))
        }, 1000)
        return () => {
            clearInterval(id)
        }
    })
    return (
        <Box
            transition='min-width 100ms'
            display='inline-block'
            // minWidth={texts[i].length * 0.9 + 'ch'}
            {...props}
        >
            <Faded duration={500} key={i}>
                <Box d='inline' minWidth='0px' bg='rgba(255,223,155,0.5)'>
                    {texts[i].toLowerCase()}
                </Box>
            </Faded>
        </Box>
    )
}

export default Page

// FEATURES

export const Features = ({ ...rest }) => {
    return (
        <PageContainer>
            <Stack
                direction={['column', null, 'row']}
                as={Faded}
                width='100%'
                cascade
                damping={0.6}
                spacing='6'
                fontWeight='600'
                letterSpacing='0.06em'
                fontSize='1.3em'
                justify='space-between'
                align='center'
                // flexWrap='wrap'
                {...rest}
            >
                {[
                    { heading: 'DEVELOP', icon: ExperimentStep },
                    { heading: 'SHOWCASE', icon: ShowcaseStep },
                    { heading: 'ANALYZE', icon: AnalyzeStep },
                    { heading: 'DOCUMENT', icon: DocsStep },
                ].map((x) => (
                    <Stack
                        w={['100%', null, 'auto']}
                        align='center'
                        spacing='10'
                    >
                        <Box h='70px' as={x.icon} />
                        <Box>{x.heading.toUpperCase()}</Box>
                    </Stack>
                ))}
            </Stack>
        </PageContainer>
    )
}
