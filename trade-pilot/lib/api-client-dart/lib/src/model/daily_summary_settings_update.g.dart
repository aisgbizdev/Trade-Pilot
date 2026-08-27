// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_summary_settings_update.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DailySummarySettingsUpdate extends DailySummarySettingsUpdate {
  @override
  final bool? enabled;
  @override
  final String? time;
  @override
  final String? timezone;

  factory _$DailySummarySettingsUpdate(
          [void Function(DailySummarySettingsUpdateBuilder)? updates]) =>
      (DailySummarySettingsUpdateBuilder()..update(updates))._build();

  _$DailySummarySettingsUpdate._({this.enabled, this.time, this.timezone})
      : super._();
  @override
  DailySummarySettingsUpdate rebuild(
          void Function(DailySummarySettingsUpdateBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DailySummarySettingsUpdateBuilder toBuilder() =>
      DailySummarySettingsUpdateBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DailySummarySettingsUpdate &&
        enabled == other.enabled &&
        time == other.time &&
        timezone == other.timezone;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, enabled.hashCode);
    _$hash = $jc(_$hash, time.hashCode);
    _$hash = $jc(_$hash, timezone.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DailySummarySettingsUpdate')
          ..add('enabled', enabled)
          ..add('time', time)
          ..add('timezone', timezone))
        .toString();
  }
}

class DailySummarySettingsUpdateBuilder
    implements
        Builder<DailySummarySettingsUpdate, DailySummarySettingsUpdateBuilder> {
  _$DailySummarySettingsUpdate? _$v;

  bool? _enabled;
  bool? get enabled => _$this._enabled;
  set enabled(bool? enabled) => _$this._enabled = enabled;

  String? _time;
  String? get time => _$this._time;
  set time(String? time) => _$this._time = time;

  String? _timezone;
  String? get timezone => _$this._timezone;
  set timezone(String? timezone) => _$this._timezone = timezone;

  DailySummarySettingsUpdateBuilder() {
    DailySummarySettingsUpdate._defaults(this);
  }

  DailySummarySettingsUpdateBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _enabled = $v.enabled;
      _time = $v.time;
      _timezone = $v.timezone;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DailySummarySettingsUpdate other) {
    _$v = other as _$DailySummarySettingsUpdate;
  }

  @override
  void update(void Function(DailySummarySettingsUpdateBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DailySummarySettingsUpdate build() => _build();

  _$DailySummarySettingsUpdate _build() {
    final _$result = _$v ??
        _$DailySummarySettingsUpdate._(
          enabled: enabled,
          time: time,
          timezone: timezone,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
