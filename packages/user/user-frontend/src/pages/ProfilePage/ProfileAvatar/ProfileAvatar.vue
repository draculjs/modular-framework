<template>
        <profile-avatar-form v-slot="i">
            <profile-avatar-img :loading="i.loading" />
        </profile-avatar-form>
</template>

<script>
    import ProfileAvatarImg from "./ProfileAvatarImg";
    import ProfileAvatarForm from "./ProfileAvatarForm";
    export default {
        name: "ProfileAvatar",
        components: {ProfileAvatarForm, ProfileAvatarImg},
    }
</script>
