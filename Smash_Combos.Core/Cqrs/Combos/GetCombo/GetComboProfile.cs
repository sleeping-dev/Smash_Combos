﻿using AutoMapper;
using Smash_Combos.Domain.Models;

namespace Smash_Combos.Core.Cqrs.Combos.GetCombo
{
    public class GetComboProfile : Profile
    {
        public GetComboProfile()
        {
            CreateMap<Combo, GetComboResponse>();
            CreateMap<Comment, CommentDto>();
            CreateMap<User, UserDto>();
        }
    }
}
