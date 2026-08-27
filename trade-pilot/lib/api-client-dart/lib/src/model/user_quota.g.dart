// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_quota.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserQuota extends UserQuota {
  @override
  final int id;
  @override
  final int customQuotaPerHour;
  @override
  final int customQuotaPerDay;

  factory _$UserQuota([void Function(UserQuotaBuilder)? updates]) =>
      (UserQuotaBuilder()..update(updates))._build();

  _$UserQuota._(
      {required this.id,
      required this.customQuotaPerHour,
      required this.customQuotaPerDay})
      : super._();
  @override
  UserQuota rebuild(void Function(UserQuotaBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserQuotaBuilder toBuilder() => UserQuotaBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserQuota &&
        id == other.id &&
        customQuotaPerHour == other.customQuotaPerHour &&
        customQuotaPerDay == other.customQuotaPerDay;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, customQuotaPerHour.hashCode);
    _$hash = $jc(_$hash, customQuotaPerDay.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserQuota')
          ..add('id', id)
          ..add('customQuotaPerHour', customQuotaPerHour)
          ..add('customQuotaPerDay', customQuotaPerDay))
        .toString();
  }
}

class UserQuotaBuilder implements Builder<UserQuota, UserQuotaBuilder> {
  _$UserQuota? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _customQuotaPerHour;
  int? get customQuotaPerHour => _$this._customQuotaPerHour;
  set customQuotaPerHour(int? customQuotaPerHour) =>
      _$this._customQuotaPerHour = customQuotaPerHour;

  int? _customQuotaPerDay;
  int? get customQuotaPerDay => _$this._customQuotaPerDay;
  set customQuotaPerDay(int? customQuotaPerDay) =>
      _$this._customQuotaPerDay = customQuotaPerDay;

  UserQuotaBuilder() {
    UserQuota._defaults(this);
  }

  UserQuotaBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _customQuotaPerHour = $v.customQuotaPerHour;
      _customQuotaPerDay = $v.customQuotaPerDay;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserQuota other) {
    _$v = other as _$UserQuota;
  }

  @override
  void update(void Function(UserQuotaBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserQuota build() => _build();

  _$UserQuota _build() {
    final _$result = _$v ??
        _$UserQuota._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'UserQuota', 'id'),
          customQuotaPerHour: BuiltValueNullFieldError.checkNotNull(
              customQuotaPerHour, r'UserQuota', 'customQuotaPerHour'),
          customQuotaPerDay: BuiltValueNullFieldError.checkNotNull(
              customQuotaPerDay, r'UserQuota', 'customQuotaPerDay'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
