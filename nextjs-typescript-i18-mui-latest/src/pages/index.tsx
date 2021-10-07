import Copyright from '@/components/Copyright'
import ProTip from '@/components/ProTip'
import { Box, Container, Link, Typography } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'
// import { GetServerSideProps } from 'next'
// import useTranslation from 'next-translate/useTranslation'
import NextLink from 'next/link'
import React from 'react'

// const useStyles = makeStyles((theme) => ({
//   list: {},
// }))

// export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
//   return {
//     props: {},
//   }
// }

export default function Index() {
  // const classes = useStyles()

  // const { t } = useTranslation() // default namespace (optional)

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Link href="/about" color="secondary" component={NextLink}>
          Go to the about page
        </Link>
        <br />
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  )
}
