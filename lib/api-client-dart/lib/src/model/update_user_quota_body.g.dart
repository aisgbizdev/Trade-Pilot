// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_user_quota_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateUserQuotaBody extends UpdateUserQuotaBody {
  @override
  final int customQuotaPerHour;
  @override
  final int customQuotaPerDay;

  factory _$UpdateUserQuotaBody(
          [void Function(UpdateUserQuotaBodyBuilder)? updates]) =>
      (UpdateUserQuotaBodyBuilder()..update(updates))._build();

  _$UpdateUserQuotaBody._(
      {required this.customQuotaPerHour, required this.customQuotaPerDay})
      : super._();
  @override
  UpdateUserQuotaBody rebuild(
          void Function(UpdateUserQuotaBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateUserQuotaBodyBuilder toBuilder() =>
      UpdateUserQuotaBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateUserQuotaBody &&
        customQuotaPerHour == other.customQuotaPerHour &&
        customQuotaPerDay == other.customQuotaPerDay;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, customQuotaPerHour.hashCode);
    _$hash = $jc(_$hash, customQuotaPerDay.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateUserQuotaBody')
          ..add('customQuotaPerHour', customQuotaPerHour)
          ..add('customQuotaPerDay', customQuotaPerDay))
        .toString();
  }
}

class UpdateUserQuotaBodyBuilder
    implements Builder<UpdateUserQuotaBody, UpdateUserQuotaBodyBuilder> {
  _$UpdateUserQuotaBody? _$v;

  int? _customQuotaPerHour;
  int? get customQuotaPerHour => _$this._customQuotaPerHour;
  set customQuotaPerHour(int? customQuotaPerHour) =>
      _$this._customQuotaPerHour = customQuotaPerHour;

  int? _customQuotaPerDay;
  int? get customQuotaPerDay => _$this._customQuotaPerDay;
  set customQuotaPerDay(int? customQuotaPerDay) =>
      _$this._customQuotaPerDay = customQuotaPerDay;

  UpdateUserQuotaBodyBuilder() {
    UpdateUserQuotaBody._defaults(this);
  }

  UpdateUserQuotaBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _customQuotaPerHour = $v.customQuotaPerHour;
      _customQuotaPerDay = $v.customQuotaPerDay;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateUserQuotaBody other) {
    _$v = other as _$UpdateUserQuotaBody;
  }

  @override
  void update(void Function(UpdateUserQuotaBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateUserQuotaBody build() => _build();

  _$UpdateUserQuotaBody _build() {
    final _$result = _$v ??
        _$UpdateUserQuotaBody._(
          customQuotaPerHour: BuiltValueNullFieldError.checkNotNull(
              customQuotaPerHour, r'UpdateUserQuotaBody', 'customQuotaPerHour'),
          customQuotaPerDay: BuiltValueNullFieldError.checkNotNull(
              customQuotaPerDay, r'UpdateUserQuotaBody', 'customQuotaPerDay'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
