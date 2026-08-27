// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'alert_status.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AlertStatus extends AlertStatus {
  @override
  final bool enabled;
  @override
  final int armedCount;
  @override
  final BuiltList<AlertLevelRow> levels;

  factory _$AlertStatus([void Function(AlertStatusBuilder)? updates]) =>
      (AlertStatusBuilder()..update(updates))._build();

  _$AlertStatus._(
      {required this.enabled, required this.armedCount, required this.levels})
      : super._();
  @override
  AlertStatus rebuild(void Function(AlertStatusBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AlertStatusBuilder toBuilder() => AlertStatusBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AlertStatus &&
        enabled == other.enabled &&
        armedCount == other.armedCount &&
        levels == other.levels;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, enabled.hashCode);
    _$hash = $jc(_$hash, armedCount.hashCode);
    _$hash = $jc(_$hash, levels.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AlertStatus')
          ..add('enabled', enabled)
          ..add('armedCount', armedCount)
          ..add('levels', levels))
        .toString();
  }
}

class AlertStatusBuilder implements Builder<AlertStatus, AlertStatusBuilder> {
  _$AlertStatus? _$v;

  bool? _enabled;
  bool? get enabled => _$this._enabled;
  set enabled(bool? enabled) => _$this._enabled = enabled;

  int? _armedCount;
  int? get armedCount => _$this._armedCount;
  set armedCount(int? armedCount) => _$this._armedCount = armedCount;

  ListBuilder<AlertLevelRow>? _levels;
  ListBuilder<AlertLevelRow> get levels =>
      _$this._levels ??= ListBuilder<AlertLevelRow>();
  set levels(ListBuilder<AlertLevelRow>? levels) => _$this._levels = levels;

  AlertStatusBuilder() {
    AlertStatus._defaults(this);
  }

  AlertStatusBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _enabled = $v.enabled;
      _armedCount = $v.armedCount;
      _levels = $v.levels.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AlertStatus other) {
    _$v = other as _$AlertStatus;
  }

  @override
  void update(void Function(AlertStatusBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AlertStatus build() => _build();

  _$AlertStatus _build() {
    _$AlertStatus _$result;
    try {
      _$result = _$v ??
          _$AlertStatus._(
            enabled: BuiltValueNullFieldError.checkNotNull(
                enabled, r'AlertStatus', 'enabled'),
            armedCount: BuiltValueNullFieldError.checkNotNull(
                armedCount, r'AlertStatus', 'armedCount'),
            levels: levels.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'levels';
        levels.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AlertStatus', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
