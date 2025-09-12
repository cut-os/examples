import { version, name } from './package.json'
import gulp from 'gulp'
import zip from 'gulp-zip'

function lwa() {
  return gulp
    .src('dist/**/*', { encoding: false })
    .pipe(zip(`${name}-v${version}.lwa`))
    .pipe(gulp.dest('dist'))
}

function myCustomTasks() {
  console.log('✨ Starting custom task...')
  gulp.series(lwa)()
  console.log('✨ Finished custom task...')
}

export default function cutosBundle() {
  return {
    name: 'my-plugin',
    apply: 'build',
    writeBundle() {
      return myCustomTasks()
    }
  }
}
