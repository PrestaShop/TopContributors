import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'
import type { Contributor, Company } from '@/types'

export function useContributorModalRouter(contributors: Contributor[] | Ref<Contributor[]>) {
  const isModalOpen = ref(false)
  const currentContributor = ref<Contributor | null>(null)

  const getContributors = () => (Array.isArray(contributors) ? contributors : contributors.value)

  const parseContributorParam = (): string | null => {
    const params = new URLSearchParams(window.location.search)
    const contributor = params.get('contributor')
    return contributor && contributor.trim().length > 0 ? contributor.trim() : null
  }

  const openModal = (item: Contributor | Company) => {
    const contributor = item as Contributor
    if (!contributor?.login) {
      console.warn('[useContributorModalRouter] openModal called with non-contributor:', item)
      return
    }
    currentContributor.value = contributor
    isModalOpen.value = true
    navigateTo(contributor.login)
  }

  const closeModal = () => {
    isModalOpen.value = false
    currentContributor.value = null
    const url = new URL(window.location.href)
    url.searchParams.delete('contributor')
    history.replaceState(null, '', url.toString())
  }

  const navigateTo = (login: string) => {
    const url = new URL(window.location.href)
    const currentParam = url.searchParams.get('contributor')
    if (currentParam !== login) {
      url.searchParams.set('contributor', login)
      history.pushState(null, '', url.toString())
    }
  }

  const copyProfileLink = async (contributor: Contributor) => {
    const url = new URL(window.location.href)
    url.searchParams.set('contributor', contributor.login)

    try {
      await navigator.clipboard.writeText(url.toString())
    }
    catch (e) {
      console.info('Clipboard API not supported, falling back to execCommand.', e)
      const el = document.createElement('textarea')
      el.value = url.toString()
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }

  const tryOpenFromUrl = () => {
    const login = parseContributorParam()
    if (!login) return

    // Legacy links used ?contributor=login on the landing page.
    // Redirect them to the dedicated detail route (which now exists).
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      useRouter().replace(`/contributor/${encodeURIComponent(login)}`)
      return
    }

    const list = getContributors()
    const found = list.find(c => c.login === login)
    if (found) {
      currentContributor.value = found
      isModalOpen.value = true
    }
  }

  const onPopState = () => {
    const login = parseContributorParam()
    if (login) {
      tryOpenFromUrl()
    }
    else {
      // Si le paramètre contributor n'existe plus, fermer le modal
      if (isModalOpen.value) {
        isModalOpen.value = false
        currentContributor.value = null
      }
    }
  }

  onMounted(() => {
    tryOpenFromUrl()
    window.addEventListener('popstate', onPopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', onPopState)
  })

  watch(
    () => (Array.isArray(contributors) ? contributors : contributors.value),
    () => {
      if (!currentContributor.value) tryOpenFromUrl()
    },
  )

  return {
    currentContributor,
    isModalOpen,
    openModal,
    closeModal,
    navigateTo,
    copyProfileLink,
  }
}
