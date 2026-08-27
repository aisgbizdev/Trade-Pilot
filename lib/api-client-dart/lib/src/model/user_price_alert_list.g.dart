// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_price_alert_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserPriceAlertList extends UserPriceAlertList {
  @override
  final BuiltList<UserPriceAlert> alerts;

  factory _$UserPriceAlertList(
          [void Function(UserPriceAlertListBuilder)? updates]) =>
      (UserPriceAlertListBuilder()..update(updates))._build();

  _$UserPriceAlertList._({required this.alerts}) : super._();
  @override
  UserPriceAlertList rebuild(
          void Function(UserPriceAlertListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserPriceAlertListBuilder toBuilder() =>
      UserPriceAlertListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserPriceAlertList && alerts == other.alerts;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, alerts.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserPriceAlertList')
          ..add('alerts', alerts))
        .toString();
  }
}

class UserPriceAlertListBuilder
    implements Builder<UserPriceAlertList, UserPriceAlertListBuilder> {
  _$UserPriceAlertList? _$v;

  ListBuilder<UserPriceAlert>? _alerts;
  ListBuilder<UserPriceAlert> get alerts =>
      _$this._alerts ??= ListBuilder<UserPriceAlert>();
  set alerts(ListBuilder<UserPriceAlert>? alerts) => _$this._alerts = alerts;

  UserPriceAlertListBuilder() {
    UserPriceAlertList._defaults(this);
  }

  UserPriceAlertListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _alerts = $v.alerts.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserPriceAlertList other) {
    _$v = other as _$UserPriceAlertList;
  }

  @override
  void update(void Function(UserPriceAlertListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserPriceAlertList build() => _build();

  _$UserPriceAlertList _build() {
    _$UserPriceAlertList _$result;
    try {
      _$result = _$v ??
          _$UserPriceAlertList._(
            alerts: alerts.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'alerts';
        alerts.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserPriceAlertList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
