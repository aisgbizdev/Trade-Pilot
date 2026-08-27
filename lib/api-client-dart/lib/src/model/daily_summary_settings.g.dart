// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_summary_settings.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DailySummarySettings extends DailySummarySettings {
  @override
  final bool enabled;
  @override
  final String time;
  @override
  final String timezone;
  @override
  final bool pushDailySummary;
  @override
  final String? lastSentDate;

  factory _$DailySummarySettings(
          [void Function(DailySummarySettingsBuilder)? updates]) =>
      (DailySummarySettingsBuilder()..update(updates))._build();

  _$DailySummarySettings._(
      {required this.enabled,
      required this.time,
      required this.timezone,
      required this.pushDailySummary,
      this.lastSentDate})
      : super._();
  @override
  DailySummarySettings rebuild(
          void Function(DailySummarySettingsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DailySummarySettingsBuilder toBuilder() =>
      DailySummarySettingsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DailySummarySettings &&
        enabled == other.enabled &&
        time == other.time &&
        timezone == other.timezone &&
        pushDailySummary == other.pushDailySummary &&
        lastSentDate == other.lastSentDate;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, enabled.hashCode);
    _$hash = $jc(_$hash, time.hashCode);
    _$hash = $jc(_$hash, timezone.hashCode);
    _$hash = $jc(_$hash, pushDailySummary.hashCode);
    _$hash = $jc(_$hash, lastSentDate.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DailySummarySettings')
          ..add('enabled', enabled)
          ..add('time', time)
          ..add('timezone', timezone)
          ..add('pushDailySummary', pushDailySummary)
          ..add('lastSentDate', lastSentDate))
        .toString();
  }
}

class DailySummarySettingsBuilder
    implements Builder<DailySummarySettings, DailySummarySettingsBuilder> {
  _$DailySummarySettings? _$v;

  bool? _enabled;
  bool? get enabled => _$this._enabled;
  set enabled(bool? enabled) => _$this._enabled = enabled;

  String? _time;
  String? get time => _$this._time;
  set time(String? time) => _$this._time = time;

  String? _timezone;
  String? get timezone => _$this._timezone;
  set timezone(String? timezone) => _$this._timezone = timezone;

  bool? _pushDailySummary;
  bool? get pushDailySummary => _$this._pushDailySummary;
  set pushDailySummary(bool? pushDailySummary) =>
      _$this._pushDailySummary = pushDailySummary;

  String? _lastSentDate;
  String? get lastSentDate => _$this._lastSentDate;
  set lastSentDate(String? lastSentDate) => _$this._lastSentDate = lastSentDate;

  DailySummarySettingsBuilder() {
    DailySummarySettings._defaults(this);
  }

  DailySummarySettingsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _enabled = $v.enabled;
      _time = $v.time;
      _timezone = $v.timezone;
      _pushDailySummary = $v.pushDailySummary;
      _lastSentDate = $v.lastSentDate;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DailySummarySettings other) {
    _$v = other as _$DailySummarySettings;
  }

  @override
  void update(void Function(DailySummarySettingsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DailySummarySettings build() => _build();

  _$DailySummarySettings _build() {
    final _$result = _$v ??
        _$DailySummarySettings._(
          enabled: BuiltValueNullFieldError.checkNotNull(
              enabled, r'DailySummarySettings', 'enabled'),
          time: BuiltValueNullFieldError.checkNotNull(
              time, r'DailySummarySettings', 'time'),
          timezone: BuiltValueNullFieldError.checkNotNull(
              timezone, r'DailySummarySettings', 'timezone'),
          pushDailySummary: BuiltValueNullFieldError.checkNotNull(
              pushDailySummary, r'DailySummarySettings', 'pushDailySummary'),
          lastSentDate: lastSentDate,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
