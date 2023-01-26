import { gql } from '@apollo/client'
import { forwardRef } from 'react'

import { Typography, DialogRef } from '~/components/designSystem'
import { DeletePlanDialogFragment, useDeletePlanMutation } from '~/generated/graphql'
import { WarningDialog, WarningDialogRef } from '~/components/WarningDialog'
import { useInternationalization } from '~/hooks/core/useInternationalization'
import { addToast } from '~/core/apolloClient'

gql`
  fragment DeletePlanDialog on Plan {
    id
    name
    draftInvoicesCount
    activeSubscriptionsCount
  }

  mutation deletePlan($input: DestroyPlanInput!) {
    destroyPlan(input: $input) {
      id
    }
  }
`

export interface DeletePlanDialogRef extends WarningDialogRef {}

interface DeletePlanDialogProps {
  plan: DeletePlanDialogFragment
}

export const DeletePlanDialog = forwardRef<DialogRef, DeletePlanDialogProps>(
  ({ plan }: DeletePlanDialogProps, ref) => {
    const { id, name, draftInvoicesCount, activeSubscriptionsCount } = plan
    const [deletePlan] = useDeletePlanMutation({
      onCompleted(data) {
        if (data && data.destroyPlan) {
          addToast({
            message: translate('text_625fd165963a7b00c8f59879'),
            severity: 'success',
          })
        }
      },
      update(cache, { data }) {
        if (!data?.destroyPlan) return
        const cacheId = cache.identify({
          id: data?.destroyPlan.id,
          __typename: 'Plan',
        })

        cache.evict({ id: cacheId })
      },
    })
    const { translate } = useInternationalization()

    return (
      <WarningDialog
        ref={ref}
        title={translate('text_625fd165963a7b00c8f59797', {
          planName: name,
        })}
        description={
          draftInvoicesCount > 0 || activeSubscriptionsCount || 0 ? (
            translate(
              'text_63d18bdc54f8380e7a97351a',
              draftInvoicesCount > 0 && activeSubscriptionsCount > 0
                ? {
                    usedObject1: translate(
                      'text_63d18d34f90cc83a038f843b',
                      { count: activeSubscriptionsCount },
                      activeSubscriptionsCount
                    ),
                    usedObject2: translate(
                      'text_63d18d3edaed7e11710b4d25',
                      { count: draftInvoicesCount },
                      draftInvoicesCount
                    ),
                  }
                : {
                    usedObject1:
                      activeSubscriptionsCount > 0
                        ? translate(
                            'text_63d18d34f90cc83a038f843b',
                            { count: activeSubscriptionsCount },
                            activeSubscriptionsCount
                          )
                        : translate(
                            'text_63d18d3edaed7e11710b4d25',
                            { count: draftInvoicesCount },
                            draftInvoicesCount
                          ),
                  },
              draftInvoicesCount > 0 && activeSubscriptionsCount > 0 ? 2 : 0
            )
          ) : (
            <Typography html={translate('text_625fd165963a7b00c8f597a1')} />
          )
        }
        onContinue={async () =>
          await deletePlan({
            variables: { input: { id } },
          })
        }
        continueText={translate('text_625fd165963a7b00c8f597b5')}
      />
    )
  }
)

DeletePlanDialog.displayName = 'DeletePlanDialog'
